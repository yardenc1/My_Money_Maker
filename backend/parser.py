import re


def parse_transaction(text : str):
    raw = text.strip()
    lower = raw.lower()

    amount_match = re.search(r'(\d+[\.,]?\d*)', lower)
    amount = float(amount_match.group(1)) if amount_match else 0

    if 'k' in lower:
        amount *= 1000

    transaction_type = 'expense'
    category = 'general'

    if 'משכורת' in raw or 'salary' in lower:
        transaction_type = 'income'
        category = 'salary'

    elif 'מלגה' in raw or 'scholarship' in lower:
        transaction_type = 'income'
        category = 'scholarship'

    elif 'אשראי' in raw or 'credit' in lower:
        transaction_type = 'expense'
        category = 'credit'

    elif 'מיטב' in raw or 'meitav' in lower:
        transaction_type = 'transfer'
        category = 'investment'

    elif 'חיסכון' in raw or 'saving' in lower:
        transaction_type = 'transfer'
        category = 'savings'

    return {
        'raw_text' : raw,
        'transaction_type' : transaction_type,
        'category' : category,
        'amount' : amount,
        'currency' : 'ILS',
    }
