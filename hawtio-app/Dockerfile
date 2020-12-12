FROM mcr.microsoft.com/java/jdk:13-zulu-alpine

COPY target/hawtio-app-*-SNAPSHOT.jar ./hawtio-app.jar

CMD ["sh", "-c", "${JAVA_HOME}/bin/java -jar ./hawtio-app.jar -c /"]