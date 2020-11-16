FROM node:lts-slim

# Installing tools
RUN apt-get update && \
    apt-get -y install curl wget nano vim procps sudo

# Install chrome
RUN curl -sSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable && \
    ln -s /usr/bin/google-chrome /usr/bin/chrome && \
    rm /etc/apt/sources.list.d/google.list

RUN npm config set @solarwinds:registry=http://dev-artifactory.dev.local/artifactory/api/npm/npm

RUN mkdir /app

WORKDIR /app

EXPOSE 4200 49153

COPY package.json solarwinds-nova-bits-*.tgz ./

ARG DEP_NOVA_XUI
RUN if [ "${DEP_NOVA_XUI}" ]; then \
    echo "installing solarwinds-nova-bits-${DEP_NOVA_XUI}.tgz"; \
    yarn add file:solarwinds-nova-bits-${DEP_NOVA_XUI}.tgz -D; \
else yarn; \
fi
