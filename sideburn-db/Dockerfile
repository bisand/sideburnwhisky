FROM python:alpine

RUN apk add --no-cache alpine-sdk linux-headers curl-dev xz-dev
RUN wget https://fastdl.mongodb.org/src/mongodb-src-r5.0.3.tar.gz && tar xf mongodb-src-r5.0.3.tar.gz
WORKDIR /mongodb-src-r5.0.3
RUN python3 -m pip install -r etc/pip/compile-requirements.txt

VOLUME /data/db
EXPOSE 27017 28017

COPY run.sh /root
ENTRYPOINT [ "/root/run.sh" ]
CMD [ "mongod", "--bind_ip", "0.0.0.0" ]