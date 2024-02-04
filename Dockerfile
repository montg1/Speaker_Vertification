#!/usr/bin/env dockerfile
# -*- coding: utf-8 -*-

FROM python:3.8.5
LABEL maintainer "Oatsada Chatthong"
ADD . / 
RUN apt-get update \ 
    && apt-get install gcc -y \
    && pip install --no-cache-dir -r requirements.txt \
    && rm -rf /var/lib/apt/lists/* 
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
