FROM tenforce/virtuoso

USER root


RUN apt-get update && \
    apt-get install -y netcat bash && \
    rm -rf /var/lib/apt/lists/*


RUN mkdir -p /data /rdf /scripts && chmod -R 777 /data /rdf /scripts

WORKDIR /data
