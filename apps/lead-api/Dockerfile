FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY server.py generate_roi_report.py followups.py ./
COPY sample_roi_lead.json test_followups.py ./
COPY fonts/ fonts/
COPY assets/ assets/

ENV DATA_DIR=/data
VOLUME /data
EXPOSE 8090

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8090"]
