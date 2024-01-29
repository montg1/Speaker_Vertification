#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from .db import TSUTAYA_MEMBER
import uuid

def generate_id() -> str:
    """ generate random ID """
    return 'spkr'+ str(uuid.uuid4().hex)[0:6]

def is_adult(x_card_id : str) -> bool:
    if TSUTAYA_MEMBER[x_card_id]['age'] >= 18: 
        return True
    else:
        return False
