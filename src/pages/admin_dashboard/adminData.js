export const adminStorageKey = 'learnershub-admin-data'

export const initialAdminData = {
  students: [
    { id: 'ST-1001', name: 'Olivia Martin', status: 'Active' },
    { id: 'ST-1002', name: 'Ethan Wilson', status: 'Active' },
    { id: 'ST-1003', name: 'Amara Johnson', status: 'Disabled' },
    { id: 'ST-1004', name: 'Lucas Brown', status: 'Active' },
  ],
  teachers: [
    { id: 'TC-2001', name: 'Ava Thompson', status: 'Active' },
    { id: 'TC-2002', name: 'Liam Patel', status: 'Active' },
    { id: 'TC-2003', name: 'Mia Chen', status: 'Disabled' },
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
