FROM node:lts-slim
ENV NODE_OPTIONS --max-old-space-size=8192
# Installing tools
RUN apt-get update && \
    apt-get -y install git curl wget nano vim procps sudo xvfb

# Install chrome
RUN curl -sSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable && \
    ln -s /usr/bin/google-chrome /usr/bin/chrome && \
    rm /etc/apt/sources.list.d/google.list

EXPOSE 4200 49153
