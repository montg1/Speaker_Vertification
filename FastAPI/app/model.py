#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from pydantic import BaseModel
from enum import Enum

class RegisterObject(BaseModel):
    id: str 
    name : str
    enrollment_audio : str


class LoginObject(BaseModel):
    id: str 
    enrollment_audio : str
 