import transporter from './mailer';
import { Payment } from '../entities/payments.entity';
import AppDataSource from '../database/db';
import { paymentRole
 } from '../enum';

async function sendPaymentConfirmationEmail(userEmail: string,
   orderId: number, paymentId: number) {
    const existpayment= await Payment.findOne({where:{id:paymentId}})
  const mailOptions = {
    from: 
    process.env.EMAIL_USERNAME,
    to: userEmail,
    subject: 'تأكيد الدفع',
    text: `تمت عملية الدفع بنجاح.
    
    تفاصيل الدفع:
    - معرف الطلب: ${orderId}
    - المبلغ المدفوع: ${existpayment?.finalAmount} دولارًا

    شكرًا لاستخدامك خدمتنا!`
  };

  const paymentRepository =AppDataSource.getRepository(Payment);
  const paymentexist = await paymentRepository.findOne({where:{id:Number(paymentId)}});

  if (!paymentexist) {
    throw new Error('Payment not found');
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log('تم إرسال إشعار الدفع بنجاح.');

    
    
    
    paymentexist.status = paymentRole.Paid;
    await paymentRepository.save(paymentexist);

  } catch (error) {
    console.error('حدث خطأ أثناء إرسال الإشعار:', error);

   
    paymentexist.status = paymentRole.Failed;
    await paymentRepository.save(paymentexist);

    throw new Error('Error sending payment confirmation email');
  }
}

export { sendPaymentConfirmationEmail };
