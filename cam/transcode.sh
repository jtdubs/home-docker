#!/bin/sh

cvlc -R rtsp://cam.dubs.zone:554/s2 --sout "#transcode{vcodec=mjpg,scale=1.0,fps=15,acodec=none}:standard{access=http{mime=multipart/x-mixed-replace;boundary=7b3cc56e5f51db803f790dad720ed50a},mux=mpjpeg,dst=:8080/s0.mjpeg}"
