import io
import os
import fitz
import uuid
import boto3
from botocore.client import Config

account_id = os.getenv('ACCOUNT_ID')
access_key_id = os.getenv('ACCESS_KEY_ID')
access_key_secret = os.getenv('ACCESS_KEY_SECRET')
bucket = os.getenv('BUCKET')

s3 = boto3.client(
    's3',
    endpoint_url=f'https://{account_id}.r2.cloudflarestorage.com',
    config=Config(signature_version='s3v4'),
    aws_access_key_id=access_key_id,
    aws_secret_access_key=access_key_secret,
    region_name='auto'
)

def upload_pdf_s3(pdf_file, id=uuid.uuid4()):
    """
    Upload a PDF file to S3
    :param pdf_file: FileStorage: PDF file to upload
    :return: str: link to the uploaded file
    """
    pdf_link = f"pdf_{id}.pdf"
    s3.upload_fileobj(pdf_file, bucket, pdf_link)
    return pdf_link

def get_pdf_s3(pdf_link):
    """
    Get a PDF file from S3
    :param pdf: str: link to the PDF file
    :return: FileStorage: PDF file
    """
    response = s3.get_object(Bucket=bucket, Key=pdf_link)
    body = response['Body']
    mime = response['ContentType']
    pdf = fitz.open(mime, body.read())
    return pdf

def extract_pdf(pdf, id=uuid.uuid4()):
    """
    Extract text and image from a PDF file
    :param pdf: fitz.fitz.PDF: PDF object
    :return: {"text": str, "images": {page_number: [images]}}: full text and images links
    """
    text = ""
    images = {}
    for i in range(pdf.page_count):
        page = pdf[i]
        text += page.get_text()
        images[i+1] = []
        for img in page.get_images(full=True):
            xref = img[0]
            base_image = pdf.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            image_path = f"pdf_{id}_page_{i+1}_image_{len(images)+1}.{image_ext}"
            s3.upload_fileobj(io.BytesIO(image_bytes), bucket, image_path)
            images[i+1].append(image_path)
    return {"text": text, "images": images}
