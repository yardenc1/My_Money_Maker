from fastapi import Depends, FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from db import Base, engine, get_db
from models import Transaction
from parser import parse_transaction

app = FastAPI(title = 'My Money Maker API')

app.add_middleware(
    CORSMiddleware,
    allow_origins = [
        'https://my-money-maker-pi.vercel.app',
        'https://my-money-maker-git-main-yardenco5900-6526s-projects.vercel.app',
        'https://my-money-maker-9d3nv02mw-yardenco5900-6526s-projects.vercel.app',
    ],
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*'],
)

Base.metadata.create_all(bind = engine)


@app.get('/health')
def health_check():
    return {'status' : 'ok'}


@app.get('/transactions')
def get_transactions(db : Session = Depends(get_db)):
    transactions = db.query(Transaction).order_by(Transaction.id.desc()).all()
    return [
        {
            'id' : t.id,
            'raw_text' : t.raw_text,
            'transaction_type' : t.transaction_type,
            'category' : t.category,
            'amount' : t.amount,
            'currency' : t.currency,
            'source' : t.source,
            'created_at' : t.created_at,
        }
        for t in transactions
    ]


@app.post('/transactions')
def add_transaction(text : str = Form(...), db : Session = Depends(get_db)):
    parsed = parse_transaction(text)

    transaction = Transaction(
        raw_text = parsed['raw_text'],
        transaction_type = parsed['transaction_type'],
        category = parsed['category'],
        amount = parsed['amount'],
        currency = parsed['currency'],
        source = 'manual',
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return {
        'message' : 'transaction saved',
        'transaction_id' : transaction.id,
        'parsed' : parsed,
    }


@app.post('/webhooks/twilio')
def twilio_webhook(Body : str = Form(...), db : Session = Depends(get_db)):
    parsed = parse_transaction(Body)

    transaction = Transaction(
        raw_text = parsed['raw_text'],
        transaction_type = parsed['transaction_type'],
        category = parsed['category'],
        amount = parsed['amount'],
        currency = parsed['currency'],
        source = 'twilio',
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return {
        'message' : 'twilio message processed',
        'transaction_id' : transaction.id,
        'parsed' : parsed,
    }
