import { useState, useEffect } from 'react';
import { TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCouponString, setCouponValidity } from "../../../store/slices/CouponSlice";
import { changePriceBasedOnCoupon } from "../../../store/slices/CheckoutSlice";

import React from "react";
import { RootState } from '../../../store/store';
import axiosInstance from "../../../axios/axiosInstance";
import { Divider } from '@mui/material';

const CouponInput = () => {
  const dispatch = useDispatch();
  const coupon = useSelector((state: RootState) => state.couponSlice);

  useEffect(() => {
    const validateCoupon = async () => {
      if (coupon.couponString) {
        try {
          const getCouponResponse = await axiosInstance.get(
            "/coupon/" + coupon.couponString, //strip spaces later
            { headers: { "Content-Type": "application/json" } }
          );
          let isValid = getCouponResponse.data.isValid
          if (isValid){
            dispatch(setCouponValidity({validity: isValid, multiplier: getCouponResponse.data.multiplier}))
            dispatch(changePriceBasedOnCoupon(getCouponResponse.data.multiplier))
          }
          else{
            dispatch(setCouponValidity({validity: isValid}))
            dispatch(changePriceBasedOnCoupon(1))
          }
        } catch (error) {
          dispatch(setCouponValidity({validity: null}))
        }
      } else {
        dispatch(setCouponValidity({validity: null}))
        dispatch(changePriceBasedOnCoupon(1))
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
      <Divider/>
        <Typography variant="body1" sx={{textAlign: "left", ml: 5, mt: 1, fontWeight: "bold"}}>
        Possui um cupom de desconto?
      </Typography>
      <TextField
        type="text"
        sx={{
          width: "80%",
          mb: 2,
          mt: 1,
          backgroundColor: coupon.isValid === true ? 'lightgreen' : coupon.couponString === '' ? 'white' : 'lightred',
        }}
        label="Digite seu cupom aqui!"
        variant="filled"
        value={coupon.couponString}
        onChange={handleInputChange}
      />
      { (coupon.isValid === false && coupon.couponString != '') && (
        <Typography color="error">Cupom inválido. Por favor, verifique o código.</Typography>
      )}
      { (coupon.isValid === true) && (
        <Typography color="green">Desconto de 95% aplicado!</Typography> // TODO: Calcule it latter
      )}
    </div>
  );
};

export default CouponInput