FROM couchdb:latest
COPY ./mycustom.ini .
COPY ./local.ini .

RUN cp mycustom.ini /opt/couchdb/etc/local.d/
RUN cp local.ini /opt/couchdb/etc/
