export const adminStorageKey = 'learnershub-admin-data'

export const initialAdminData = {
  students: [
    { id: 'ST-1001', name: 'Olivia Martin', email: 'olivia.martin@example.com', phone: '+1 (555) 010-1001', program: 'Web Development', progress: '68% complete', joined: '2025-08-14', status: 'Active' },
    { id: 'ST-1002', name: 'Ethan Wilson', email: 'ethan.wilson@example.com', phone: '+1 (555) 010-1002', program: 'Python for Data Analysis', progress: '42% complete', joined: '2025-09-02', status: 'Active' },
    { id: 'ST-1003', name: 'Amara Johnson', email: 'amara.johnson@example.com', phone: '+1 (555) 010-1003', program: 'UI/UX Design', progress: '25% complete', joined: '2025-06-21', status: 'Disabled' },
    { id: 'ST-1004', name: 'Lucas Brown', email: 'lucas.brown@example.com', phone: '+1 (555) 010-1004', program: 'Web Development', progress: '81% complete', joined: '2025-10-11', status: 'Active' },
  ],
  teachers: [
    { id: 'TC-2001', name: 'Ava Thompson', email: 'ava.thompson@example.com', phone: '+1 (555) 020-1001', subject: 'Web Development', experience: '8 years', joined: '2024-03-18', status: 'Active' },
    { id: 'TC-2002', name: 'Liam Patel', email: 'liam.patel@example.com', phone: '+1 (555) 020-1002', subject: 'Data Analysis', experience: '6 years', joined: '2024-07-09', status: 'Active' },
    { id: 'TC-2003', name: 'Mia Chen', email: 'mia.chen@example.com', phone: '+1 (555) 020-1003', subject: 'UI/UX Design', experience: '5 years', joined: '2025-01-27', status: 'Disabled' },
  ],
  courses: [
    { id: 'WEB-101', title: 'Introduction to Web Development', status: 'Published' },
    { id: 'PY-305', title: 'Python for Data Analysis', status: 'Published' },
    { id: 'DES-110', title: 'UI/UX Design Fundamentals', status: 'Draft' },
  ],
  payments: [
    { id: 'PAY-9001', amount: '$399.00', status: 'Paid' },
    { id: 'PAY-9002', amount: '$549.00', status: 'Paid' },
    { id: 'PAY-9003', amount: '$449.00', status: 'Pending' },
  ],
}
