#!/bin/sh

docker build -t transcode:0.1 .
docker tag transcode:0.1 transcode:latest
