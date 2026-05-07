const DataStore = {
    init() {
        if (!localStorage.getItem('erpData')) {
            const initialData = {
                employees: [
                    { id: 1, name: 'John Smith', email: 'john@erp.com', department: 'Sales', role: 'Sales Manager', status: 'Active' },
                    { id: 2, name: 'Sarah Johnson', email: 'sarah@erp.com', department: 'IT', role: 'Lead Developer', status: 'Active' },
                    { id: 3, name: 'Mike Chen', email: 'mike@erp.com', department: 'HR', role: 'HR Specialist', status: 'Active' },
                    { id: 4, name: 'Emily Davis', email: 'emily@erp.com', department: 'Finance', role: 'Accountant', status: 'Inactive' },
                    { id: 5, name: 'Robert Wilson', email: 'robert@erp.com', department: 'Operations', role: 'Operations Manager', status: 'Active' }
                ],
                inventory: [
                    { id: 1, sku: 'PROD-001', name: 'Laptop Dell XPS', category: 'Electronics', quantity: 45, price: 1299.99 },
                    { id: 2, sku: 'PROD-002', name: 'Office Chair', category: 'Furniture', quantity: 8, price: 249.99 },
                    { id: 3, sku: 'PROD-003', name: 'Printer Ink Cartridge', category: 'Office Supplies', quantity: 120, price: 34.99 },
                    { id: 4, sku: 'PROD-004', name: 'Steel Panels', category: 'Raw Materials', quantity: 5, price: 150.00 },
                    { id: 5, sku: 'PROD-005', name: 'Monitor 27"', category: 'Electronics', quantity: 32, price: 399.99 }
                ],
                sales: [
                    { id: 1, customer: 'Acme Corp', date: '2024-01-15', items: 'Laptop, Mouse, Keyboard', total: 1450.00, status: 'Completed' },
                    { id: 2, customer: 'TechStart Inc', date: '2024-01-16', items: 'Monitor x2, Webcam', total: 850.00, status: 'Processing' },
                    { id: 3, customer: 'BuildRight LLC', date: '2024-01-17', items: 'Steel Panels x20', total: 3000.00, status: 'Pending' },
                    { id: 4, customer: 'Office Plus', date: '2024-01-18', items: 'Office Chairs x10', total: 2499.90, status: 'Completed' },
                    { id: 5, customer: 'Design Studio', date: '2024-01-19', items: 'Printer, Toner', total: 340.00, status: 'Cancelled' }
                ],
                transactions: [
                    { id: 1, date: '2024-01-15', description: 'Sale to Acme Corp', category: 'Sales', type: 'income', amount: 1450.00 },
                    { id: 2, date: '2024-01-16', description: 'Office Rent', category: 'Utilities', type: 'expense', amount: 2500.00 },
                    { id: 3, date: '2024-01-17', description: 'Sale to BuildRight', category: 'Sales', type: 'income', amount: 3000.00 },
                    { id: 4, date: '2024-01-18', description: 'Employee Salaries', category: 'Salary', type: 'expense', amount: 15000.00 },
                    { id: 5, date: '2024-01-20', description: 'Office Supplies Purchase', category: 'Purchase', type: 'expense', amount: 450.00 }
                ],
                activity: [
                    { type: 'add', message: 'New order #1234 created', time: '2 hours ago' },
                    { type: 'edit', message: 'Updated inventory for PROD-001', time: '4 hours ago' },
                    { type: 'order', message: 'Order #1230 completed by Acme Corp', time: '6 hours ago' },
                    { type: 'delete', message: 'Removed employee record #12', time: '1 day ago' },
                    { type: 'add', message: 'New product added: Monitor 27\"', time: '1 day ago' }
                ],
                settings: {
                    companyName: 'Lauda Lassun Pvt.Ltd.',
                    email: 'tausifahm5370@gmail.com',
                    phone: '+91 886478889',
                    address: 'At Technova Hostel Of Dr.M.C Saxena College Of Engineering & Technology 171, Barawankala Mall Road, Dubagga-IIM Bypass, Lucknow, Uttar Pradesh ·',
                    darkMode: false
                }
            };
            localStorage.setItem('erpData', JSON.stringify(initialData));
        }
        return JSON.parse(localStorage.getItem('erpData'));
    },

    getData() {
        return JSON.parse(localStorage.getItem('erpData'));
    },

    saveData(data) {
        localStorage.setItem('erpData', JSON.stringify(data));
    },

    resetData() {
        localStorage.removeItem('erpData');
        this.init();
    }
};

// ================= Chart.js Global Defaults =================
Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
Chart.defaults.scale.grid.color = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();

// ================= Application State =================
let chartInstances = {};
let currentModule = 'dashboard';

// ================= Initialization =================
document.addEventListener('DOMContentLoaded', () => {
    DataStore.init();
    initializeNavigation();
    initializeTheme();
    initializeSearch();
    initializeForms();
    loadDashboard();
    loadEmployees();
    loadInventory();
    loadSales();
    loadFinance();
    loadSettings();

    // Mobile menu toggle
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('mobile-open');
    });
});

// ================= Navigation =================
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const module = link.getAttribute('data-module');
            switchModule(module);

            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Close mobile sidebar
            document.getElementById('sidebar').classList.remove('mobile-open');
        });
    });
}

function switchModule(moduleName) {
    // Hide all modules
    document.querySelectorAll('.module').forEach(module => {
        module.classList.remove('active');
    });

    // Show selected module
    document.getElementById(moduleName).classList.add('active');
    currentModule = moduleName;

    // Refresh data for the module
    switch (moduleName) {
        case 'dashboard': loadDashboard(); break;
        case 'employees': loadEmployees(); break;
        case 'inventory': loadInventory(); break;
        case 'sales': loadSales(); break;
        case 'finance': loadFinance(); break;
        case 'settings': loadSettings(); break;
    }
}

// ================= Theme Management =================
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const data = DataStore.getData();

    if (data.settings.darkMode) {
        document.body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.checked = true;
    }

    themeToggle.addEventListener('click', toggleTheme);
    if (darkModeToggle) darkModeToggle.addEventListener('change', toggleTheme);
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');

    const data = DataStore.getData();
    data.settings.darkMode = isDark;
    DataStore.saveData(data);

    // Update button text
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.innerHTML = isDark
        ? '<i class="fas fa-sun"></i> <span>Light Mode</span>'
        : '<i class="fas fa-moon"></i> <span>Dark Mode</span>';

    // Refresh charts with new theme colors
    updateChartColors();

    showToast('Theme updated successfully', 'info');
}

function updateChartColors() {
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
    const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();

    Chart.defaults.color = textColor;
    Chart.defaults.scale.grid.color = gridColor;

    // Re-render active charts
    if (currentModule === 'dashboard') {
        loadDashboard();
    } else if (currentModule === 'finance') {
        loadFinance();
    }
}

// ================= Dashboard =================
function loadDashboard() {
    const data = DataStore.getData();

    // Update KPIs
    const totalRevenue = data.sales.filter(s => s.status === 'Completed').reduce((sum, s) => sum + s.total, 0);
    const totalOrders = data.sales.length;
    const totalEmployees = data.employees.filter(e => e.status === 'Active').length;
    const lowStock = data.inventory.filter(i => i.quantity < 10).length;

    document.getElementById('kpiRevenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('kpiOrders').textContent = totalOrders;
    document.getElementById('kpiEmployees').textContent = totalEmployees;
    document.getElementById('kpiLowStock').textContent = lowStock;

    // Load activity
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = data.activity.slice(0, 6).map(activity => `
        <li>
            <div class="activity-icon ${activity.type}">
                <i class="fas fa-${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-details">
                <p>${activity.message}</p>
                <span>${activity.time}</span>
            </div>
        </li>
    `).join('');

    // Revenue Chart
    renderRevenueChart(data);
    renderOrderChart(data);
}

function getActivityIcon(type) {
    const icons = { add: 'plus', edit: 'edit', delete: 'trash', order: 'shopping-bag' };
    return icons[type] || 'info-circle';
}

function renderRevenueChart(data) {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;

    if (chartInstances.revenue) chartInstances.revenue.destroy();

    const monthlyRevenue = {};
    data.sales.filter(s => s.status === 'Completed').forEach(sale => {
        const month = sale.date.substring(0, 7);
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + sale.total;
    });

    const labels = Object.keys(monthlyRevenue).sort();
    const values = labels.map(l => monthlyRevenue[l]);

    chartInstances.revenue = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(l => {
                const [year, month] = l.split('-');
                return `${month}/${year}`;
            }),
            datasets: [{
                label: 'Revenue ($)',
                data: values.length ? values : [0],
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function renderOrderChart(data) {
    const ctx = document.getElementById('orderChart');
    if (!ctx) return;

    if (chartInstances.order) chartInstances.order.destroy();

    const statusCounts = { Pending: 0, Processing: 0, Completed: 0, Cancelled: 0 };
    data.sales.forEach(s => { statusCounts[s.status]++; });

    chartInstances.order = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: ['#f59e0b', '#3b82f6', '#22c55e', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

// ================= Employees =================
function loadEmployees() {
    const data = DataStore.getData();
    renderTable('employeeTable', data.employees, createEmployeeRow);

    // Search and filter
    const searchInput = document.getElementById('employeeSearch');
    const filterSelect = document.getElementById('employeeFilter');

    searchInput.oninput = () => filterData(data.employees, 'employeeTable', createEmployeeRow, searchInput, filterSelect, ['name', 'email']);
    filterSelect.onchange = () => filterData(data.employees, 'employeeTable', createEmployeeRow, searchInput, filterSelect, ['name', 'email']);
}

function createEmployeeRow(emp) {
    return `
        <tr>
            <td>#${emp.id}</td>
            <td>${emp.name}</td>
            <td>${emp.email}</td>
            <td>${emp.department}</td>
            <td>${emp.role}</td>
            <td><span class="badge badge-${emp.status === 'Active' ? 'success' : 'secondary'}">${emp.status}</span></td>
            <td>
                <button class="btn-action edit" onclick="editEmployee(${emp.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-action delete" onclick="deleteEmployee(${emp.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `;
}

function filterData(dataArray, tableId, createRowFn, searchInput, filterSelect, searchFields) {
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;

    const filtered = dataArray.filter(item => {
        const matchesSearch = searchFields.some(field => item[field].toLowerCase().includes(searchTerm));
        const matchesFilter = filterValue === 'all' || item.department === filterValue || item.status === filterValue || item.category === filterValue;
        return matchesSearch && matchesFilter;
    });

    renderTable(tableId, filtered, createRowFn);
}

// ================= Inventory =================
function loadInventory() {
    const data = DataStore.getData();
    renderTable('inventoryTable', data.inventory, createInventoryRow);

    const searchInput = document.getElementById('inventorySearch');
    const filterSelect = document.getElementById('inventoryFilter');

    searchInput.oninput = () => filterData(data.inventory, 'inventoryTable', createInventoryRow, searchInput, filterSelect, ['name', 'sku']);
    filterSelect.onchange = () => filterData(data.inventory, 'inventoryTable', createInventoryRow, searchInput, filterSelect, ['name', 'sku']);
}

function createInventoryRow(item) {
    const status = item.quantity < 10 ? 'Low Stock' : item.quantity < 50 ? 'Medium' : 'In Stock';
    const statusClass = item.quantity < 10 ? 'danger' : item.quantity < 50 ? 'warning' : 'success';

    return `
        <tr>
            <td>${item.sku}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.quantity}</td>
            <td>${formatCurrency(item.price)}</td>
            <td><span class="badge badge-${statusClass}">${status}</span></td>
            <td>
                <button class="btn-action edit" onclick="editProduct(${item.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-action delete" onclick="deleteProduct(${item.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `;
}

// ================= Sales =================
function loadSales() {
    const data = DataStore.getData();
    renderTable('salesTable', data.sales, createSalesRow);

    const searchInput = document.getElementById('salesSearch');
    const filterSelect = document.getElementById('salesFilter');

    searchInput.oninput = () => filterData(data.sales, 'salesTable', createSalesRow, searchInput, filterSelect, ['customer', 'items']);
    filterSelect.onchange = () => filterData(data.sales, 'salesTable', createSalesRow, searchInput, filterSelect, ['customer', 'items']);
}

function createSalesRow(sale) {
    const statusClass = sale.status === 'Completed' ? 'success' : sale.status === 'Processing' ? 'info' : sale.status === 'Pending' ? 'warning' : 'danger';

    return `
        <tr>
            <td>#${sale.id}</td>
            <td>${sale.customer}</td>
            <td>${formatDate(sale.date)}</td>
            <td>${sale.items}</td>
            <td>${formatCurrency(sale.total)}</td>
            <td><span class="badge badge-${statusClass}">${sale.status}</span></td>
            <td>
                <button class="btn-action edit" onclick="editOrder(${sale.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-action delete" onclick="deleteOrder(${sale.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `;
}

// ================= Finance =================
function loadFinance() {
    const data = DataStore.getData();

    const income = data.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = data.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const profit = income - expense;

    document.getElementById('financeIncome').textContent = formatCurrency(income);
    document.getElementById('financeExpense').textContent = formatCurrency(expense);
    document.getElementById('financeProfit').textContent = formatCurrency(profit);

    renderTable('transactionTable', data.transactions, (t) => `
        <tr>
            <td>#${t.id}</td>
            <td>${formatDate(t.date)}</td>
            <td>${t.description}</td>
            <td>${t.category}</td>
            <td><span class="badge badge-${t.type === 'income' ? 'success' : 'danger'}">${t.type}</span></td>
            <td class="${t.type === 'income' ? 'text-success' : 'text-danger'}">${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}</td>
        </tr>
    `);

    renderFinanceChart(data);
}

function renderFinanceChart(data) {
    const ctx = document.getElementById('financeChart');
    if (!ctx) return;

    if (chartInstances.finance) chartInstances.finance.destroy();

    const monthlyData = { income: {}, expense: {} };
    data.transactions.forEach(t => {
        const month = t.date.substring(0, 7);
        monthlyData[t.type][month] = (monthlyData[t.type][month] || 0) + t.amount;
    });

    const months = [...new Set([...Object.keys(monthlyData.income), ...Object.keys(monthlyData.expense)])].sort();
    const incomeData = months.map(m => monthlyData.income[m] || 0);
    const expenseData = months.map(m => monthlyData.expense[m] || 0);

    chartInstances.finance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months.map(m => {
                const [year, month] = m.split('-');
                return `${month}/${year}`;
            }),
            datasets: [
                { label: 'Income', data: incomeData, backgroundColor: '#22c55e' },
                { label: 'Expenses', data: expenseData, backgroundColor: '#ef4444' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

// ================= Settings =================
function loadSettings() {
    const data = DataStore.getData();
    document.getElementById('companyName').value = data.settings.companyName;
    document.getElementById('companyEmail').value = data.settings.email;
    document.getElementById('companyPhone').value = data.settings.phone;
    document.getElementById('companyAddress').value = data.settings.address;
}

// ================= Form Handlers =================
function initializeForms() {
    // Employee Form
    document.getElementById('employeeForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveEmployee();
    });

    // Inventory Form
    document.getElementById('inventoryForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveProduct();
    });

    // Sales Form
    document.getElementById('salesForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveOrder();
    });

    // Transaction Form
    document.getElementById('transactionForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveTransaction();
    });

    // Company Settings Form
    document.getElementById('companyForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const data = DataStore.getData();
        data.settings.companyName = document.getElementById('companyName').value;
        data.settings.email = document.getElementById('companyEmail').value;
        data.settings.phone = document.getElementById('companyPhone').value;
        data.settings.address = document.getElementById('companyAddress').value;
        DataStore.saveData(data);
        showToast('Settings saved successfully', 'success');
    });
}

// ================= CRUD Operations: Employees =================
function saveEmployee() {
    const data = DataStore.getData();
    const id = parseInt(document.getElementById('employeeId').value) || 0;
    const employee = {
        id: id || (data.employees.length > 0 ? Math.max(...data.employees.map(e => e.id)) + 1 : 1),
        name: document.getElementById('empName').value,
        email: document.getElementById('empEmail').value,
        department: document.getElementById('empDepartment').value,
        role: document.getElementById('empRole').value,
        status: document.getElementById('empStatus').value
    };

    if (id) {
        const index = data.employees.findIndex(e => e.id === id);
        if (index !== -1) data.employees[index] = employee;
        addActivity('edit', `Updated employee ${employee.name}`);
    } else {
        data.employees.push(employee);
        addActivity('add', `New employee added: ${employee.name}`);
    }

    DataStore.saveData(data);
    closeModal('employeeModal');
    loadEmployees();
    showToast('Employee saved successfully', 'success');
}

function editEmployee(id) {
    const data = DataStore.getData();
    const emp = data.employees.find(e => e.id === id);
    if (!emp) return;

    document.getElementById('employeeId').value = emp.id;
    document.getElementById('empName').value = emp.name;
    document.getElementById('empEmail').value = emp.email;
    document.getElementById('empDepartment').value = emp.department;
    document.getElementById('empRole').value = emp.role;
    document.getElementById('empStatus').value = emp.status;
    document.getElementById('employeeModalTitle').textContent = 'Edit Employee';

    openModal('employeeModal');
}

function deleteEmployee(id) {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    const data = DataStore.getData();
    data.employees = data.employees.filter(e => e.id !== id);
    DataStore.saveData(data);
    loadEmployees();
    addActivity('delete', `Deleted employee #${id}`);
    showToast('Employee deleted successfully', 'success');
}

// ================= CRUD Operations: Inventory =================
function saveProduct() {
    const data = DataStore.getData();
    const id = parseInt(document.getElementById('productId').value) || 0;
    const product = {
        id: id || (data.inventory.length > 0 ? Math.max(...data.inventory.map(i => i.id)) + 1 : 1),
        name: document.getElementById('prodName').value,
        category: document.getElementById('prodCategory').value,
        quantity: parseInt(document.getElementById('prodQuantity').value),
        price: parseFloat(document.getElementById('prodPrice').value),
        sku: document.getElementById('prodSku').value || `PROD-${String(data.inventory.length + 1).padStart(3, '0')}`
    };

    if (id) {
        const index = data.inventory.findIndex(i => i.id === id);
        if (index !== -1) data.inventory[index] = product;
        addActivity('edit', `Updated product ${product.name}`);
    } else {
        data.inventory.push(product);
        addActivity('add', `New product added: ${product.name}`);
    }

    DataStore.saveData(data);
    closeModal('inventoryModal');
    loadInventory();
    showToast('Product saved successfully', 'success');
}

function editProduct(id) {
    const data = DataStore.getData();
    const product = data.inventory.find(i => i.id === id);
    if (!product) return;

    document.getElementById('productId').value = product.id;
    document.getElementById('prodName').value = product.name;
    document.getElementById('prodCategory').value = product.category;
    document.getElementById('prodQuantity').value = product.quantity;
    document.getElementById('prodPrice').value = product.price;
    document.getElementById('prodSku').value = product.sku;
    document.getElementById('inventoryModalTitle').textContent = 'Edit Product';

    openModal('inventoryModal');
}

function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const data = DataStore.getData();
    data.inventory = data.inventory.filter(i => i.id !== id);
    DataStore.saveData(data);
    loadInventory();
    addActivity('delete', `Deleted product #${id}`);
    showToast('Product deleted successfully', 'success');
}

// ================= CRUD Operations: Sales =================
function saveOrder() {
    const data = DataStore.getData();
    const order = {
        id: data.sales.length > 0 ? Math.max(...data.sales.map(s => s.id)) + 1 : 1,
        customer: document.getElementById('orderCustomer').value,
        date: new Date().toISOString().split('T')[0],
        items: document.getElementById('orderItems').value,
        total: parseFloat(document.getElementById('orderTotal').value),
        status: document.getElementById('orderStatus').value
    };

    data.sales.push(order);

    // Add corresponding transaction
    data.transactions.push({
        id: data.transactions.length > 0 ? Math.max(...data.transactions.map(t => t.id)) + 1 : 1,
        date: order.date,
        description: `Sale to ${order.customer}`,
        category: 'Sales',
        type: 'income',
        amount: order.total
    });

    DataStore.saveData(data);
    closeModal('salesModal');
    loadSales();
    addActivity('order', `New order #${order.id} created`);
    showToast('Order created successfully', 'success');
}

function editOrder(id) {
    showToast('Edit order functionality coming soon', 'info');
}

function deleteOrder(id) {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    const data = DataStore.getData();
    const order = data.sales.find(s => s.id === id);
    if (order) {
        order.status = 'Cancelled';
        DataStore.saveData(data);
        loadSales();
        addActivity('delete', `Order #${id} cancelled`);
        showToast('Order cancelled', 'info');
    }
}

// ================= CRUD Operations: Finance =================
function saveTransaction() {
    const data = DataStore.getData();
    const transaction = {
        id: data.transactions.length > 0 ? Math.max(...data.transactions.map(t => t.id)) + 1 : 1,
        date: new Date().toISOString().split('T')[0],
        description: document.getElementById('transDesc').value,
        category: document.getElementById('transCategory').value,
        type: document.getElementById('transType').value,
        amount: parseFloat(document.getElementById('transAmount').value)
    };

    data.transactions.push(transaction);
    DataStore.saveData(data);
    closeModal('transactionModal');
    loadFinance();
    addActivity(transaction.type === 'income' ? 'add' : 'delete', `Transaction: ${transaction.description}`);
    showToast('Transaction added successfully', 'success');
}

// ================= Global Search =================
function initializeSearch() {
    const globalSearch = document.getElementById('globalSearch');
    globalSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        if (searchTerm.length < 2) return;

        const data = DataStore.getData();
        let results = [];

        data.employees.forEach(emp => {
            if (emp.name.toLowerCase().includes(searchTerm) || emp.email.toLowerCase().includes(searchTerm)) {
                results.push({ type: 'Employee', name: emp.name, link: 'employees' });
            }
        });

        data.inventory.forEach(item => {
            if (item.name.toLowerCase().includes(searchTerm) || item.sku.toLowerCase().includes(searchTerm)) {
                results.push({ type: 'Product', name: item.name, link: 'inventory' });
            }
        });

        data.sales.forEach(sale => {
            if (sale.customer.toLowerCase().includes(searchTerm)) {
                results.push({ type: 'Order', name: sale.customer, link: 'sales' });
            }
        });

        if (results.length > 0) {
            showToast(`Found ${results.length} results for "${searchTerm}"`, 'info');
        }
    });
}

// ================= Data Management =================
function exportData() {
    const data = DataStore.getData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'erp-data-export.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully', 'success');
}

function resetData() {
    if (!confirm('WARNING: This will reset all data to defaults. Are you sure?'))
        return;

    DataStore.resetData();
    showToast('All data has been reset to defaults', 'success');
    location.reload();
}

// ================= Modal Management =================
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = 'auto';

    // Reset forms
    const form = document.querySelector(`#${modalId} form`);
    if (form) {
        form.reset();
        const hiddenId = form.querySelector('input[type="hidden"]');
        if (hiddenId) hiddenId.value = '';
    }

    // Reset modal titles
    if (modalId === 'employeeModal') {
        document.getElementById('employeeModalTitle').textContent = 'Add Employee';
    }
    if (modalId === 'inventoryModal') {
        document.getElementById('inventoryModalTitle').textContent = 'Add Product';
    }
}

// Close modal when clicking outside
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};

// ================= Utility Functions =================
function renderTable(tableId, data, createRowFn) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 30px;">No data found</td></tr>';
        return;
    }

    tbody.innerHTML = data.map(item => createRowFn(item)).join('');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount || 0);
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.className = `toast ${type} show`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i> ${message}`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function addActivity(type, message) {
    const data = DataStore.getData();
    data.activity.unshift({
        type,
        message,
        time: 'Just now'
    });

    // Keep only latest 20 activities
    if (data.activity.length > 20) {
        data.activity = data.activity.slice(0, 20);
    }

    DataStore.saveData(data);
}

// ================= Keyboard Shortcuts =================
document.addEventListener('keydown', (e) => {
    // ESC to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
    }

    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('globalSearch').focus();
    }

    // Ctrl/Cmd + N for new item based on current module
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        switch (currentModule) {
            case 'employees': openModal('employeeModal'); break;
            case 'inventory': openModal('inventoryModal'); break;
            case 'sales': openModal('salesModal'); break;
            case 'finance': openModal('transactionModal'); break;
        }
    }
});

// ================= Print Functionality =================
function printReport() {
    window.print();
}

console.log('ERP Management System v1.0 - Loaded Successfully');
console.log('Shortcuts: ESC = Close modal, Ctrl+K = Search, Ctrl+N = New item');
