FROM python:3.10.2-slim-buster

WORKDIR .

COPY . .

RUN pip install -U pipenv

RUN pipenv install --system --deploy

ENTRYPOINT ["python3"]
CMD ["-m", "webtube"]
