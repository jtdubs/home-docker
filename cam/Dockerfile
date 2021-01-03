FROM alpine:latest
RUN apk add vlc
RUN addgroup -S user && adduser -S user -G user
COPY transcode.sh /home/user/
USER user
ENTRYPOINT /home/user/transcode.sh
