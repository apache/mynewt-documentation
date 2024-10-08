How to Use Event Queues to Manage Multiple Events
=================================================
.. contents::
   :local:
   :depth: 2
   
Introduction
------------

The event queue mechanism allows you to serialize incoming events for
your task. You can use it to get information about hardware interrupts,
callout expirations, and messages from other tasks.

The benefit of using events for inter-task communication is that it can
reduce the number of resources that need to be shared and locked.

The benefit of processing interrupts in a task context instead of the
interrupt context is that other interrupts and high priority tasks are
not blocked waiting for the interrupt handler to complete processing. A
task can also access other OS facilities and sleep.

This tutorial assumes that you have read about :doc:`Event Queues <../../../os/core_os/event_queue/event_queue>`, the :doc:`Hardware Abstraction Layer <../../../os/modules/hal/hal>`, and :doc:`OS Callouts <../../../os/core_os/callout/callout>` in the OS User’s Guide.

This tutorial shows you how to create an application that uses events
for:

-  Inter-task communication
-  OS callouts for timer expiration
-  GPIO interrupts

It also shows you how to:

-  Use the Mynewt default event queue and application main task to
   process your events.
-  Create a dedicated event queue and task for your events.

To reduce an application’s memory requirement, we recommend that you use
the Mynewt default event queue if your application or package does not
have real-time timing requirements.

Prerequisites
-------------

Ensure that you have met the following prerequisites before continuing
with this tutorial:

-  Install the newt tool.
-  Install the newtmgr tool.
-  Have Internet connectivity to fetch remote Mynewt components.
-  Install the compiler tools to support native compiling to build the
   project this tutorial creates.
-  Have a cable to establish a serial USB connection between the board
   and the laptop.

Example Application
-------------------

In this example, you will write an application, for the Nordic nRF52
board, that uses events from three input sources to toggle three GPIO
outputs and light up the LEDs. If you are using a different board, you
will need to adjust the GPIO pin numbers in the code example.

The application handles events from three sources on two event queues:

-  Events generated by an application task at periodic intervals are
   added to the Mynewt default event queue.
-  OS callouts for timer events are added to the
   ``my_timer_interrupt_eventq`` event queue.
-  GPIO interrupt events are added to the ``my_timer_interrupt_eventq``
   event queue. 

Create the Project 
~~~~~~~~~~~~~~~~~~

Follow the instructions in the :doc:`nRF52 tutorial for Blinky <../blinky/nRF52>` to create a project.

Create the Application 
~~~~~~~~~~~~~~~~~~~~~~

Create the ``pkg.yml`` file for the application:

.. code-block:: console

   pkg.name: apps/eventq_example
   pkg.type: app

   pkg.deps:
       - kernel/os
       - hw/hal
       - sys/console/stub

Application Task Generated Events
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The application creates a task that generates events, at periodic
intervals, to toggle the LED at pin ``TASK_LED``. The event is queued on
the Mynewt default event queue and is processed in the context of the
application main task.

Declare and initialize the ``gen_task_ev`` event with the ``my_ev_cb()``
callback function to process the event:

.. code-block:: c


   /* Callback function for application task event */
   static void my_ev_cb(struct os_event *);

   /* Initialize the event with the callback function */
   static struct os_event gen_task_ev = {
       .ev_cb = my_ev_cb,
   };

Implement the ``my_ev_cb()`` callback function to process a task
generated event and toggle the LED at pin ``TASK_LED``:

.. code-block:: c


   /* LED 1 (P0.17 on the board) */
   #define TASK_LED        17

   /*
    * Event callback function for events generated by gen_task. It toggles 
    * the LED at pin TASK_LED.
    */
   static void my_ev_cb(struct os_event *ev)
   {
       assert(ev);
       hal_gpio_toggle(TASK_LED);
       return;
   }

Create a task that generates an event at periodic intervals and adds,
using the ``os_eventq_put()`` function, the event to the Mynewt default
event queue:

.. code-block:: c

   #define GEN_TASK_PRIO       3     
   #define GEN_TASK_STACK_SZ   512

   static os_stack_t gen_task_stack[GEN_TASK_STACK_SZ];
   static struct os_task gen_task_str;

   /* 
    * Task handler to generate an event to toggle the LED at pin TASK_LED. 
    * The event is added to the Mynewt default event queue. 
    */
   static void
   gen_task(void *arg)
   {
       while (1) {
           os_time_delay(OS_TICKS_PER_SEC / 4);
           os_eventq_put(os_eventq_dflt_get(), &gen_task_ev);
       }
   }

   static void
   init_tasks(void)
   {

       /* Create a task to generate events to toggle the LED at pin TASK_LED */

       os_task_init(&gen_task_str, "gen_task", gen_task, NULL, GEN_TASK_PRIO,
                    OS_WAIT_FOREVER, gen_task_stack, GEN_TASK_STACK_SZ);

         ...

   }

Implement the application ``main()`` function to call the
``os_eventq_run()`` function to dequeue an event from the Mynewt default
event queue and call the callback function to process the event.

.. code-block:: c

   int
   main(int argc, char **argv)
   {
       sysinit();

       init_tasks();
     
       while (1) {
          os_eventq_run(os_eventq_dflt_get());     
       }
       assert(0);
   }

OS Callout Timer Events
~~~~~~~~~~~~~~~~~~~~~~~

Set up OS callout timer events. For this example, we use a dedicated
event queue for timer events to show you how to create a dedicated event
queue and a task to process the events.

Implement the ``my_timer_ev_cb()`` callback function to process a timer
event and toggle the LED at pin ``CALLOUT_LED``:

.. code-block:: c


   /* LED 2 (P0.18 on the board) */
   #define CALLOUT_LED     18

   /* The timer callout */
   static struct os_callout my_callout;

   /*
    * Event callback function for timer events. It toggles the LED at pin CALLOUT_LED.
    */
   static void my_timer_ev_cb(struct os_event *ev)
   {
       assert(ev != NULL);
     
       hal_gpio_toggle(CALLOUT_LED);
          
       os_callout_reset(&my_callout, OS_TICKS_PER_SEC / 2);
   }

In the ``init_tasks()`` function, initialize the
``my_timer_interrupt_eventq`` event queue, create a task to process
events from the queue, and initialize the OS callout for the timer:

.. code-block:: c

   #define MY_TIMER_INTERRUPT_TASK_PRIO  4
   #define MY_TIMER_INTERRUPT_TASK_STACK_SZ    512

   static os_stack_t my_timer_interrupt_task_stack[MY_TIMER_INTERRUPT_TASK_STACK_SZ];
   static struct os_task my_timer_interrupt_task_str;

   static void
   init_tasks(void)
   {
       /* Use a dedicate event queue for timer and interrupt events */
    
       os_eventq_init(&my_timer_interrupt_eventq);  

       /* 
        * Create the task to process timer and interrupt events from the
        * my_timer_interrupt_eventq event queue.
        */
       os_task_init(&my_timer_interrupt_task_str, "timer_interrupt_task", 
                    my_timer_interrupt_task, NULL, 
                    MY_TIMER_INTERRUPT_TASK_PRIO, OS_WAIT_FOREVER, 
                    my_timer_interrupt_task_stack, 
                    MY_TIMER_INTERRUPT_TASK_STACK_SZ);
        /* 
         * Initialize the callout for a timer event.  
         * The my_timer_ev_cb callback function processes the timer events.
         */
       os_callout_init(&my_callout, &my_timer_interrupt_eventq,  
                       my_timer_ev_cb, NULL);

       os_callout_reset(&my_callout, OS_TICKS_PER_SEC);

   }

Implement the ``my_timer_interrupt_task()`` task handler to dispatch
events from the ``my_timer_interrupt_eventq`` event queue:

.. code-block:: c


   static void
   my_timer_interrupt_task(void *arg)
   {
       while (1) {
           os_eventq_run(&my_timer_interrupt_eventq);
       }
   }

Interrupt Events
~~~~~~~~~~~~~~~~

The application toggles the LED each time button 1 on the board is
pressed. The interrupt handler generates an event when the GPIO for
button 1 (P0.13) changes state. The events are added to the
``my_timer_interrupt_eventq`` event queue, the same queue as the timer
events.

Declare and initialize the ``gpio_ev`` event with the
``my_interrupt_ev_cb()`` callback function to process the event:

.. code-block:: c

   static struct os_event gpio_ev {
       .ev_cb = my_interrupt_ev_cb,
   };

Implement the ``my_interrupt_ev_cb()`` callback function to process an
interrupt event and toggle the LED at pin ``GPIO_LED``:

.. code-block:: c


   /* LED 3 (P0.19 on the board) */
   #define GPIO_LED     19

   /*
    * Event callback function for interrupt events. It toggles the LED at pin GPIO_LED.
    */
   static void my_interrupt_ev_cb(struct os_event *ev)
   {
       assert(ev != NULL);
       
       hal_gpio_toggle(GPIO_LED);
   }

Implement the ``my_gpio_irq()`` handler to post an interrupt event to
the ``my_timer_interrupt_eventq`` event queue:

.. code-block:: c

   static void
   my_gpio_irq(void *arg)
   {
       os_eventq_put(&my_timer_interrupt_eventq, &gpio_ev);
   }

In the ``init_tasks()`` function, add the code to set up and enable the
GPIO input pin for the button and initialize the GPIO output pins for
the LEDs:

.. code-block:: c

   /* LED 1 (P0.17 on the board) */
   #define TASK_LED        17 

   /*  2 (P0.18 on the board) */
   #define CALLOUT_LED     18 

   /* LED 3 (P0.19 on the board) */
   #define GPIO_LED        19

   /* Button 1 (P0.13 on the board) */
   #define BUTTON1_PIN     13

   void 
   init_tasks()

       /* Initialize OS callout for timer events. */

             ....

       /* 
        * Initialize and enable interrupts for the pin for button 1 and 
        * configure the button with pull up resistor on the nrf52dk.
        */ 
       hal_gpio_irq_init(BUTTON1_PIN, my_gpio_irq, NULL, HAL_GPIO_TRIG_RISING, HAL_GPIO_PULL_UP);

       hal_gpio_irq_enable(BUTTON1_PIN);

       /* Initialize the GPIO output pins. Value 1 is off for these LEDs.  */
      
       hal_gpio_init_out(TASK_LED, 1);
       hal_gpio_init_out(CALLOUT_LED, 1);
       hal_gpio_init_out(GPIO_LED, 1);
   }

Putting It All Together
~~~~~~~~~~~~~~~~~~~~~~~

Here is the complete ``main.c`` source for your application. Build the
application and load it on your board. The task LED (LED1) blinks at an
interval of 250ms, the callout LED (LED2) blinks at an interval of
500ms, and the GPIO LED (LED3) toggles on or off each time you press
Button 1.

.. code-block:: c

   #include <os/os.h>
   #include <bsp/bsp.h>
   #include <hal/hal_gpio.h>
   #include <assert.h>
   #include <sysinit/sysinit.h>


   #define MY_TIMER_INTERRUPT_TASK_PRIO  4
   #define MY_TIMER_INTERRUPT_TASK_STACK_SZ    512

   #define GEN_TASK_PRIO       3
   #define GEN_TASK_STACK_SZ   512

   /* LED 1 (P0.17 on the board) */
   #define TASK_LED        17

   /* LED 2 (P0.18 on the board) */
   #define CALLOUT_LED     18

   /* LED 3 (P0.19 on the board) */
   #define GPIO_LED        19

   /* Button 1 (P0.13 on the board) */
   #define BUTTON1_PIN     13


   static void my_ev_cb(struct os_event *);
   static void my_timer_ev_cb(struct os_event *);
   static void my_interrupt_ev_cb(struct os_event *);

   static struct os_eventq my_timer_interrupt_eventq;

   static os_stack_t my_timer_interrupt_task_stack[MY_TIMER_INTERRUPT_TASK_STACK_SZ];
   static struct os_task my_timer_interrupt_task_str;

   static os_stack_t gen_task_stack[GEN_TASK_STACK_SZ];
   static struct os_task gen_task_str;

   static struct os_event gen_task_ev = {
       .ev_cb = my_ev_cb,
   };

   static struct os_event gpio_ev = {
       .ev_cb = my_interrupt_ev_cb,
   };


   static struct os_callout my_callout;

   /*
    * Task handler to generate an event to toggle the LED at pin TASK_LED.
    * The event is added to the Mynewt default event queue.
    */

   static void
   gen_task(void *arg)
   {
       while (1) {
           os_time_delay(OS_TICKS_PER_SEC / 4);
           os_eventq_put(os_eventq_dflt_get(), &gen_task_ev);
       }
   }

   /*
    * Event callback function for events generated by gen_task. It toggles the LED at pin TASK_LED. 
    */
   static void my_ev_cb(struct os_event *ev)
   {
       assert(ev);
       hal_gpio_toggle(TASK_LED);
       return;
   }

   /*
    * Event callback function for timer events. It toggles the LED at pin CALLOUT_LED.
    */
   static void my_timer_ev_cb(struct os_event *ev)
   {
       assert(ev != NULL);
     
       hal_gpio_toggle(CALLOUT_LED);
       os_callout_reset(&my_callout, OS_TICKS_PER_SEC / 2);
   }

   /*
    * Event callback function for interrupt events. It toggles the LED at pin GPIO_LED.
    */
   static void my_interrupt_ev_cb(struct os_event *ev)
   {
       assert(ev != NULL);
       
       hal_gpio_toggle(GPIO_LED);
   }

   static void
   my_gpio_irq(void *arg)
   {
       os_eventq_put(&my_timer_interrupt_eventq, &gpio_ev);
   }



   static void
   my_timer_interrupt_task(void *arg)
   {
       while (1) {
           os_eventq_run(&my_timer_interrupt_eventq);
       }
   }

   void
   init_tasks(void)
   {
       
       /* Create a task to generate events to toggle the LED at pin TASK_LED */

       os_task_init(&gen_task_str, "gen_task", gen_task, NULL, GEN_TASK_PRIO,
           OS_WAIT_FOREVER, gen_task_stack, GEN_TASK_STACK_SZ);


       /* Use a dedicate event queue for timer and interrupt events */
       os_eventq_init(&my_timer_interrupt_eventq);  

       /* 
        * Create the task to process timer and interrupt events from the
        * my_timer_interrupt_eventq event queue.
        */
       os_task_init(&my_timer_interrupt_task_str, "timer_interrupt_task", 
                    my_timer_interrupt_task, NULL, 
                    MY_TIMER_INTERRUPT_TASK_PRIO, OS_WAIT_FOREVER, 
                    my_timer_interrupt_task_stack, 
                    MY_TIMER_INTERRUPT_TASK_STACK_SZ);

       /* 
        * Initialize the callout for a timer event.  
        * The my_timer_ev_cb callback function processes the timer event.
        */
       os_callout_init(&my_callout, &my_timer_interrupt_eventq,  
                       my_timer_ev_cb, NULL);

       os_callout_reset(&my_callout, OS_TICKS_PER_SEC);

       /* 
        * Initialize and enable interrupt for the pin for button 1 and 
        * configure the button with pull up resistor on the nrf52dk.
        */ 
       hal_gpio_irq_init(BUTTON1_PIN, my_gpio_irq, NULL, HAL_GPIO_TRIG_RISING, HAL_GPIO_PULL_UP);

       hal_gpio_irq_enable(BUTTON1_PIN);

       hal_gpio_init_out(TASK_LED, 1);
       hal_gpio_init_out(CALLOUT_LED, 1);
       hal_gpio_init_out(GPIO_LED, 1);
   }

   int
   main(int argc, char **argv)
   {
       sysinit();

       init_tasks();
     
       while (1) {
          os_eventq_run(os_eventq_dflt_get());     
       }
       assert(0);
   }

