from datetime import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String

from db import Base


class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key = True, index = True)
    raw_text = Column(String, nullable = False)
    transaction_type = Column(String, nullable = False)
    category = Column(String, nullable = False)
    amount = Column(Float, nullable = False)
    currency = Column(String, default = 'ILS', nullable = False)
    source = Column(String, default = 'manual', nullable = False)
    created_at = Column(DateTime, default = datetime.utcnow, nullable = False)
