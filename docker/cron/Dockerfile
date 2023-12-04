FROM deps:latest

WORKDIR /app

COPY ./docker/cron/cronconf /etc/periodic/daily/
RUN chmod +x /etc/periodic/daily/cronconf
RUN crontab -l

COPY . .

CMD crond start
