import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { User } from '../models/User';
import { sendEmail } from '../services/emailService';

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

export const resetPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });

        // Send email with reset link (link would contain the token)
        await sendEmail(user.email, 'Password Reset', `Please use this link to reset your password: https://yourapp.com/reset/${token}`);

        return res.status(200).json({ message: 'Password reset email sent.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

export const updatePassword = async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    try {
        // Verify token
        const decoded: any = jwt.verify(token, SECRET_KEY);
        const userId = decoded.id;

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password in database
        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        return res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Invalid or expired token.' });
    }
};

// Define API endpoints
export const routes = (app: any) => {
    app.post('/api/reset-password', resetPassword);
    app.post('/api/update-password', updatePassword);
};