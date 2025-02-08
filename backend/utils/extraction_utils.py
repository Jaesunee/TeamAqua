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

def extract_pdf_s3(pdf_link):
    """
    Extract text and image from a PDF file
    :param pdf_link: str: link to the PDF file
    :return: [(int, str, [str])]: list of triples containing
        page number, text, and images links if any of each page
    """
    s3 = boto3.client(
        's3',
        endpoint_url=f'https://{account_id}.r2.cloudflarestorage.com',
        config=Config(signature_version='s3v4'),
        aws_access_key_id=access_key_id,
        aws_secret_access_key=access_key_secret,
        region_name='auto'
    )
    response = s3.get_object(Bucket=bucket, Key=pdf_link)
    body = response['Body']
    mime = response['ContentType']
    pdf = fitz.open(mime, body.read())
    text_and_images = []
    for i in range(pdf.page_count):
        page_id = uuid.uuid4()
        page = pdf[i]
        text = page.get_text()
        images = []
        for img in page.get_images(full=True):
            xref = img[0]
            base_image = pdf.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            image_path = f"page{page_id}_image{len(images)+1}.{image_ext}"
            s3.upload_fileobj(io.BytesIO(image_bytes), bucket, image_path)
            images.append(image_path)
        text_and_images.append((page_id, text, images))
    return text_and_images
