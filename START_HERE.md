# ⚠️ MySQL Setup Required

## Your MySQL needs a password configured

The application requires MySQL with proper authentication. Here's how to fix it:

## Option 1: Set MySQL Password (Recommended)

1. **Find your MySQL password** (you set this during MySQL installation)
2. **Update the .env file**:
   - Open: `d:\lms3\backend\.env`
   - Find line: `DB_PASSWORD=`
   - Change to: `DB_PASSWORD=your_actual_password`
   - Save the file

## Option 2: Reset MySQL Root Password

If you forgot your password, reset it:

### Windows PowerShell (Run as Administrator):

```powershell
# Stop MySQL service
net stop MySQL80

# Start MySQL without password
mysqld --skip-grant-tables --shared-memory

# In a NEW PowerShell window:
mysql -u root

# In MySQL prompt:
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
exit;

# Stop the temp MySQL and restart service
net start MySQL80
```

Then update `.env` with your new password.

## Option 3: Use Different MySQL User

Create a new MySQL user with password:

```sql
# Login to MySQL as root
mysql -u root -p

# Create new user
CREATE USER 'lms_user'@'localhost' IDENTIFIED BY 'lms_password';
GRANT ALL PRIVILEGES ON *.* TO 'lms_user'@'localhost';
FLUSH PRIVILEGES;
exit;
```

Then update `backend\.env`:
```env
DB_USER=lms_user
DB_PASSWORD=lms_password
```

## Verify MySQL is Running

```powershell
# Check if MySQL service is running
Get-Service MySQL80
```

If not running:
```powershell
net start MySQL80
```

## After Fixing MySQL

1. **Setup database**:
   ```bash
   cd backend
   node setup-database.js
   ```

2. **Start backend** (in one terminal):
   ```bash
   cd backend
   npm start
   ```

3. **Start frontend** (in another terminal):
   ```bash
   cd frontend
   npm start
   ```

4. **Access application**:
   - Open: http://localhost:3000
   - Teacher login: teacher@example.com / password123
   - Student login: student@example.com / password123

---

## Quick Test Commands

After servers are running, test the assignment feature:

```bash
node test-assignment-submission.js
```

This will verify the complete workflow!
