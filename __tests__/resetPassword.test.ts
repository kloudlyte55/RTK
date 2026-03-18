import { requestPasswordReset, validateResetToken, updatePassword } from '../path/to/your/module';

describe('Password Reset Tests', () => {
  describe('requestPasswordReset', () => {
    it('should send a password reset request for a valid email', async () => {
      const response = await requestPasswordReset('valid@example.com');
      expect(response).toHaveProperty('success', true);
      expect(response).toHaveProperty('message', 'Password reset link sent.');
    });

    it('should handle invalid email', async () => {
      const response = await requestPasswordReset('invalid-email');
      expect(response).toHaveProperty('success', false);
      expect(response).toHaveProperty('message', 'Invalid email address.');
    });

    it('should handle duplicate requests', async () => {
      await requestPasswordReset('duplicate@example.com'); // first request
      const response = await requestPasswordReset('duplicate@example.com'); // second request
      expect(response).toHaveProperty('success', false);
      expect(response).toHaveProperty('message', 'A reset request has already been sent.');
    });
  });

  describe('validateResetToken', () => {
    it('should validate a correct reset token', async () => {
      const response = await validateResetToken('validToken123');
      expect(response).toHaveProperty('success', true);
      expect(response).toHaveProperty('message', 'Token is valid.');
    });

    it('should handle expired token', async () => {
      const response = await validateResetToken('expiredToken123');
      expect(response).toHaveProperty('success', false);
      expect(response).toHaveProperty('message', 'Token has expired.');
    });

    it('should handle invalid token', async () => {
      const response = await validateResetToken('invalidToken');
      expect(response).toHaveProperty('success', false);
      expect(response).toHaveProperty('message', 'Token is invalid.');
    });
  });

  describe('updatePassword', () => {
    it('should allow updating password with a valid token and password', async () => {
      const response = await updatePassword('validToken123', 'NewPassword123!');
      expect(response).toHaveProperty('success', true);
      expect(response).toHaveProperty('message', 'Password updated successfully.');
    });

    it('should reject weak passwords', async () => {
      const response = await updatePassword('validToken123', '123');
      expect(response).toHaveProperty('success', false);
      expect(response).toHaveProperty('message', 'Password is too weak.');
    });

    it('should handle incorrect token', async () => {
      const response = await updatePassword('invalidToken', 'NewPassword123!');
      expect(response).toHaveProperty('success', false);
      expect(response).toHaveProperty('message', 'Invalid token.');
    });
  });
});
