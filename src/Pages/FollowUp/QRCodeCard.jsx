import React from 'react';
import img from '../../assets/images/qrcode.png';
import { TailSpin } from 'react-loader-spinner';

const QRCodeCard = ({ qrCodeImage, fees, confirmPayment, isProcessingPayment }) => {
    return (
        <div className="qr-code-card">
            <h3>Consultation QR Code</h3>
            <img src={img} alt="QR Code" />
            <p className="payment-amount">Payment Amount: {fees} INR</p>
            <button onClick={confirmPayment} type='submit' className='search-spinner' disabled={isProcessingPayment}>
                {isProcessingPayment ? <><span>Please Wait</span><TailSpin color="#fff" height={34} width={44} /></> : 'Confirm Payment'}
            </button>
        </div>
    );
};

export default QRCodeCard;
