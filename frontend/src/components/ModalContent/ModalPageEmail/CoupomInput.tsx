import { useState, useEffect } from 'react';
import { TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCouponString, setCouponValidity } from "../../../store/slices/CouponSlice";
import React from "react";
import { RootState } from '../../../store/store';
import axiosInstance from "../../../axios/axiosInstance";

const CouponInput = () => {
  const dispatch = useDispatch();
  const coupon = useSelector((state: RootState) => state.couponSlice);
  const [isCouponValid, setIsCouponValid] = React.useState<Boolean | null>(null);

  useEffect(() => {
    const validateCoupon = async () => {
      if (coupon.couponString) {
        try {
          const getCouponResponse = await axiosInstance.get(
            "/coupon/" + coupon, //strip spaces later
            { headers: { "Content-Type": "application/json" } }
          );
          let isValid = getCouponResponse.data.isValid
          if (isValid){
            dispatch(setCouponValidity({validity: true, multiplier: getCouponResponse.data.multiplier}))
          }
        } catch (error) {
          dispatch(setCouponValidity({validity: false}))
        }
      } else {
        dispatch(setCouponValidity({validity: null}))
      }
    };
    validateCoupon();
  }, [coupon]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    dispatch(setCouponString(value));
  };

  return (
    <div>
      <TextField
        type="text"
        sx={{
          width: "80%",
          mb: 3,
          mt: 1,
          backgroundColor: isCouponValid === true ? 'lightgreen' : coupon.couponString === '' ? 'white' : 'lightred',
        }}
        label="Digite seu cupom..."
        variant="filled"
        value={coupon}
        onChange={handleInputChange}
      />
      {isCouponValid === false && (
        <Typography color="error">Cupom inválido. Por favor, verifique o código.</Typography>
      )}
    </div>
  );
};