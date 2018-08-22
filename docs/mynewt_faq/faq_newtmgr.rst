Mynewt FAQ: Newt Manager
========================

.. contents::
  :local:
  :depth: 1

Connection Profile with ``newtmgr``
-----------------------------------

**Q**: I’m trying to connect to an Adafruit nRF52 Feather Pro running Mynewt via the newtmgr tool on MacOS.  
I have the device powered via micro USB to my Mac.  How do I find the “connection profile” of the device so 
I can connect to it? I want to communicate over BLE and not serial. 

**A**: A connection profile tells newtmgr how to communicate with your device. You can create one using the 
``newtmgr conn add`` command. Try talking to your device without a connection profile first. If that works, 
you can create a profile to make it easier to communicate with the device going forward.

For BLE, you can send an echo command to your device with something like this:

.. code-block:: console 

  newtmgr --conntype ble --connstring peer_name=nimble-bleprph echo Hello

That ``peer_name string`` is correct if your device is running the ``bleprph`` app.  You'll need to adjust 
it if your device has a different BLE name. The ``--conntype ble --connstring peer_name=nimble-bleprph`` part 
is what would go in a connection profile. If you create one, then you can just specify the profile's name rather 
than typing that long string each time you send a command.

NMP
---

**Q**: What does NMP stand for?

**A**: Newtmgr Management Protocol

Newt Manager with the Adafruit nRF52DK
--------------------------------------

**Q**: I'm having issues using Newt Manager with the Adafruit nRF52DK. What do I do?

You can specify the reduced MTU by adding ``mtu=128`` to your connection string. The reason for this change is that 
MTU is the serial boot loader used to have a smaller receive buffer (128 bytes). The newtmgr tool sends larger image 
chunks by default, so specifying the MTU will reduce the image size. 

**A**: There are two things you will need to do to fix any issues you encounter when working with the Adafruit nRF52DK and Newt Manager:

**1. Specify a reduced MTU**:
You can specify the reduced MTU by adding ``mtu=128`` to your connection string. The reason for this change is that 
MTU is the serial boot loader used to have a smaller receive buffer (128 bytes). The newtmgr tool sends larger image 
chunks by default, so specifying the MTU will reduce the image size. 

**2. Indicate that the existing image should not be erased**:
This is accomplished with the ``-e`` command line option. Your command line should look similar to the following:
   
.. code-block:: console

  $ newtmgr --conntype serial --connextra 'dev=/dev/ttyUSB0,mtu=128' image upload -e <image-path>
   
This change is needed because the serial boot loader doesn't support the standalone "erase image" command - as a result, 
it drops the request. The newtmgr image upload command starts by sending an erase command, then times out when it doesn't 
receive a response. The older version of newtmgr would use smaller chunk size for images, and it did not send the standalone 
erase command. When newtmgr was changed in versions 1.2 and 1.3, the serial boot loader changed along with it. The latest 
newtmgr is not compatible with an older version of the boot loader (which your board will probably ship with) without the 
above workarounds.