import { Box, Button, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { closePaymentModal } from "../../store/slices/PaymentModalSlice";
import axiosInstance from "../../axios/axiosInstance";
import QRCodeImage from "../QRCodeImage/QRCodeImage";

export default function PaymentModal() {
	const open = useSelector((state: RootState) => state.paymentModalSlice.open);
	const dispatch = useDispatch();
	const handleClose = () => { dispatch(closePaymentModal()) };
	const [b64qrCode, setb64qrCode] = useState<string | null>(null)
	const price = useSelector((state: RootState) => state.checkoutSlice.price)

	useEffect(() => {
		const getQrCodeAsync = async function () {
			try {
				const cobResponse = await axiosInstance.post("/cob", { "val": price.toFixed(2) },
				{headers: { "Content-Type": "application/json" }});
				if (cobResponse.status !== 200) {
					throw Error(`/cob response failed: ${cobResponse.data}`)
				}
				const locID = cobResponse.data['locId']
				const qrCodeResponse = await axiosInstance.post("/qrcode", { "locId": locID },
					{headers: { "Content-Type": "application/json"}});
				if (qrCodeResponse.status !== 200) {
					throw Error(`/qrcode response failed: ${qrCodeResponse.data}`)
				}
				setb64qrCode(qrCodeResponse.data['qrcode'])
			} catch (error) {
				console.log("Error:", error);
			}
		}
		if (open && (price.valueOf() !== 0)){
			getQrCodeAsync()
		}
	}, [open, price])

	return (
		<>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="payment-modal"
				aria-describedby="qrcode"
			>
				<Box sx={
					{
						position: 'absolute' as 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						background: '#ffffff',
						boxShadow: 24,
						border: '2px solid #797979',
						borderRadius: '8px',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						textAlign: 'center',
						pb: 1,
					}}>
					<Typography id="modal-title" variant="h6" component="h2">
						Checkout
					</Typography>
					<Typography id="modal-description" sx={{ mt: 2 }}>
						Lembre-se de que esse site funciona adequadamente com questões com imagens pouco complexas e com conteúdos que não envolvam cálculos.
					</Typography>

					{b64qrCode ? <QRCodeImage base64String={b64qrCode} /> :
						<Typography id="loading-text" sx={{ mt: 2 }}>
						Carregando o QRCode...
						</Typography>
					}

					{/* Button to close the modal */}
					<Button variant="contained" color="primary" onClick={handleClose} sx={{ mt: 2 }}>
						Voltar
					</Button>
				</Box>
			</Modal>
		</>
	);
}