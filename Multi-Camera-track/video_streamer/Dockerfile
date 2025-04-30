FROM python:3.11.0

RUN useradd -ms /bin/bash python

WORKDIR /app

COPY requirements.txt .


RUN python -m pip install -r requirements.txt


EXPOSE 5555

# Copy application files
COPY . .

CMD tail -f /dev/null



