// تبديل اللغة
let currentLang = 'ar';

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = currentLang;
    document.body.style.direction = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('.lang').forEach(element => {
        element.textContent = element.getAttribute(`data-${currentLang}`);
    });
    document.getElementById('langSwitch').textContent = currentLang === 'ar' ? 'English' : 'العربية';
    updateDiseaseOptions(); // تحديث خيارات الأمراض عند تبديل اللغة
    updateOtherDetailsTable(); // تحديث جدول التفاصيل عند تبديل اللغة
}

// قوائم الأمراض
const diseases = {
    communicable: [
        { value: 'pneumonia', ar: 'الالتهاب الرئوي', en: 'Pneumonia' },
        { value: 'diarrhea', ar: 'الإسهال', en: 'Diarrhea' },
        { value: 'dysentery', ar: 'الدوسنتاريا', en: 'Dysentery' },
        { value: 'malaria', ar: 'الملاريا', en: 'Malaria' },
        { value: 'dengue', ar: 'حمى الضنك', en: 'Dengue Fever' },
        { value: 'deworming', ar: 'التخلص من الديدان + فيتامين أ', en: 'Deworming + Vitamin A' },
        { value: 'others-communicable', ar: 'أمراض معدية أخرى', en: 'Other Communicable Diseases' }
    ],
    'non-communicable': [
        { value: 'hypertension', ar: 'ارتفاع ضغط الدم (جديد)', en: 'Hypertension (New)' },
        { value: 'diabetes', ar: 'السكري (جديد)', en: 'Diabetes (New)' },
        { value: 'copd', ar: 'الانسداد الرئوي المزمن', en: 'COPD' },
        { value: 'heart-disease', ar: 'أمراض القلب (جديد)', en: 'Heart Disease (New)' },
        { value: 'others-non-communicable', ar: 'أمراض غير معدية أخرى', en: 'Other Non-Communicable Diseases' }
    ]
};

// تحديث خيارات الأمراض بناءً على نوع المرض المختار
function updateDiseaseOptions() {
    const diseaseType = document.getElementById('diseaseType').value;
    const diseaseSelect = document.getElementById('disease');
    diseaseSelect.innerHTML = `<option value="" disabled selected class="lang" data-ar="اختر المرض" data-en="Select Disease">${currentLang === 'ar' ? 'اختر المرض' : 'Select Disease'}</option>`;

    if (diseaseType && diseases[diseaseType]) {
        diseases[diseaseType].forEach(disease => {
            const option = document.createElement('option');
            option.value = disease.value;
            option.className = 'lang';
            option.setAttribute('data-ar', disease.ar);
            option.setAttribute('data-en', disease.en);
            option.textContent = currentLang === 'ar' ? disease.ar : disease.en;
            diseaseSelect.appendChild(option);
        });
    }
}

// الاستماع لتغيير نوع المرض
document.getElementById('diseaseType').addEventListener('change', updateDiseaseOptions);

// إظهار/إخفاء حقل تفاصيل الحالات الأخرى
document.getElementById('disease').addEventListener('change', function() {
    const otherDetailsSection = document.getElementById('otherDetailsSection');
    const selectedDisease = this.value;
    if (selectedDisease === 'others-communicable' || selectedDisease === 'others-non-communicable') {
        otherDetailsSection.style.display = 'block';
    } else {
        otherDetailsSection.style.display = 'none';
        document.getElementById('otherDetails').value = '';
    }
});

// الإدخال الصوتي لاسم المريض
const voiceBtn = document.getElementById('voiceBtn');
const patientNameInput = document.getElementById('patientName');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA'; // اللغة الافتراضية (العربية)
    recognition.interimResults = false;

    voiceBtn.addEventListener('click', () => {
        recognition.lang = currentLang === 'ar' ? 'ar-SA' : 'en-US';
        recognition.start();
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        patientNameInput.value = transcript;
    };

    recognition.onerror = (event) => {
        alert('Error occurred in speech recognition: ' + event.error);
    };
} else {
    voiceBtn.disabled = true;
    voiceBtn.textContent = currentLang === 'ar' ? 'الإدخال الصوتي غير مدعوم' : 'Voice Input Not Supported';
}

// الإدخال الصوتي لتفاصيل الحالات الأخرى
const voiceDetailsBtn = document.getElementById('voiceDetailsBtn');
const otherDetailsInput = document.getElementById('otherDetails');

if (SpeechRecognition) {
    const recognitionDetails = new SpeechRecognition();
    recognitionDetails.lang = 'ar-SA'; // اللغة الافتراضية (العربية)
    recognitionDetails.interimResults = false;

    voiceDetailsBtn.addEventListener('click', () => {
        recognitionDetails.lang = currentLang === 'ar' ? 'ar-SA' : 'en-US';
        recognitionDetails.start();
    });

    recognitionDetails.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        otherDetailsInput.value = transcript;
    };

    recognitionDetails.onerror = (event) => {
        alert('Error occurred in speech recognition: ' + event.error);
    };
} else {
    voiceDetailsBtn.disabled = true;
    voiceDetailsBtn.textContent = currentLang === 'ar' ? 'الإدخال الصوتي غير مدعوم' : 'Voice Input Not Supported';
}

// إدخال بيانات المريض
document.getElementById('patientForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // جمع بيانات المريض
    const patientName = document.getElementById('patientName').value;
    const ageGroup = document.getElementById('ageGroup').value;
    const gender = document.getElementById('gender').value;
    const diseaseType = document.getElementById('diseaseType').value;
    const disease = document.getElementById('disease').value;
    const otherDetails = document.getElementById('otherDetails').value;
    const referred = document.getElementById('referred').value;

    // تحميل البيانات من localStorage
    let patients = JSON.parse(localStorage.getItem('patients')) || [];

    // إضافة المريض الجديد
    patients.push({ name: patientName, ageGroup, gender, diseaseType, disease, otherDetails, referred });
    localStorage.setItem('patients', JSON.stringify(patients));

    // تحديث التقرير
    updateReport();
    updateOtherDetailsTable();

    // إعادة تعيين النموذج
    document.getElementById('patientForm').reset();
    document.getElementById('otherDetailsSection').style.display = 'none';
    document.getElementById('diseaseType').value = '';
    updateDiseaseOptions(); // إعادة تعيين خيارات الأمراض
});

// تحديث التقرير
function updateReport() {
    // إعادة تعيين العدادات لكل فئة عمرية
    const counters = {
        // أقل من 5 سنوات
        'under-5-pneumonia-M': 0, 'under-5-pneumonia-F': 0,
        'under-5-diarrhea-M': 0, 'under-5-diarrhea-F': 0,
        'under-5-dysentery-M': 0, 'under-5-dysentery-F': 0,
        'under-5-malaria-M': 0, 'under-5-malaria-F': 0,
        'under-5-dengue-M': 0, 'under-5-dengue-F': 0,
        'under-5-deworming-M': 0, 'under-5-deworming-F': 0,
        'under-5-others-communicable-M': 0, 'under-5-others-communicable-F': 0,
        'under-5-hypertension-M': 0, 'under-5-hypertension-F': 0,
        'under-5-diabetes-M': 0, 'under-5-diabetes-F': 0,
        'under-5-copd-M': 0, 'under-5-copd-F': 0,
        'under-5-heart-disease-M': 0, 'under-5-heart-disease-F': 0,
        'under-5-others-non-communicable-M': 0, 'under-5-others-non-communicable-F': 0,
        'under-5-referred-M': 0, 'under-5-referred-F': 0,

        // من 5 إلى 18 سنة
        '5-18-pneumonia-M': 0, '5-18-pneumonia-F': 0,
        '5-18-diarrhea-M': 0, '5-18-diarrhea-F': 0,
        '5-18-dysentery-M': 0, '5-18-dysentery-F': 0,
        '5-18-malaria-M': 0, '5-18-malaria-F': 0,
        '5-18-dengue-M': 0, '5-18-dengue-F': 0,
        '5-18-deworming-M': 0, '5-18-deworming-F': 0,
        '5-18-others-communicable-M': 0, '5-18-others-communicable-F': 0,
        '5-18-hypertension-M': 0, '5-18-hypertension-F': 0,
        '5-18-diabetes-M': 0, '5-18-diabetes-F': 0,
        '5-18-copd-M': 0, '5-18-copd-F': 0,
        '5-18-heart-disease-M': 0, '5-18-heart-disease-F': 0,
        '5-18-others-non-communicable-M': 0, '5-18-others-non-communicable-F': 0,
        '5-18-referred-M': 0, '5-18-referred-F': 0,

        // أكبر من 18 سنة
        'over-18-pneumonia-M': 0, 'over-18-pneumonia-F': 0,
        'over-18-diarrhea-M': 0, 'over-18-diarrhea-F': 0,
        'over-18-dysentery-M': 0, 'over-18-dysentery-F': 0,
        'over-18-malaria-M': 0, 'over-18-malaria-F': 0,
        'over-18-dengue-M': 0, 'over-18-dengue-F': 0,
        'over-18-deworming-M': 0, 'over-18-deworming-F': 0,
        'over-18-others-communicable-M': 0, 'over-18-others-communicable-F': 0,
        'over-18-hypertension-M': 0, 'over-18-hypertension-F': 0,
        'over-18-diabetes-M': 0, 'over-18-diabetes-F': 0,
        'over-18-copd-M': 0, 'over-18-copd-F': 0,
        'over-18-heart-disease-M': 0, 'over-18-heart-disease-F': 0,
        'over-18-others-non-communicable-M': 0, 'over-18-others-non-communicable-F': 0,
        'over-18-referred-M': 0, 'over-18-referred-F': 0
    };

    // جلب البيانات من localStorage
    const patients = JSON.parse(localStorage.getItem('patients')) || [];

    // حساب الإحصائيات
    patients.forEach(patient => {
        const key = `${patient.ageGroup}-${patient.disease}-${patient.gender}`;
        if (counters[key] !== undefined) {
            counters[key]++;
        }

        // حساب حالات الإحالة
        if (patient.referred === 'yes') {
            const referredKey = `${patient.ageGroup}-referred-${patient.gender}`;
            counters[referredKey]++;
        }
    });

    // تحديث الجدول
    for (const key in counters) {
        document.getElementById(key).textContent = counters[key];
    }
}

// تحديث جدول تفاصيل الحالات الأخرى
function updateOtherDetailsTable() {
    const patients = JSON.parse(localStorage.getItem('patients')) || [];
    const otherDetailsTableBody = document.getElementById('otherDetailsTableBody');
    otherDetailsTableBody.innerHTML = ''; // إعادة تعيين الجدول

    // تصفية الحالات التي تحتوي على تفاصيل أخرى
    const otherCases = patients.filter(patient => 
        (patient.disease === 'others-communicable' || patient.disease === 'others-non-communicable') && patient.otherDetails
    );

    otherCases.forEach(patient => {
        const row = document.createElement('tr');

        // اسم المريض
        const nameCell = document.createElement('td');
        nameCell.textContent = patient.name;
        row.appendChild(nameCell);

        // الفئة العمرية
        const ageGroupCell = document.createElement('td');
        const ageGroupText = {
            'under-5': currentLang === 'ar' ? 'أقل من 5 سنوات' : 'Under 5 years',
            '5-18': currentLang === 'ar' ? 'من 5 إلى 18 سنة' : '5 to 18 years',
            'over-18': currentLang === 'ar' ? 'أكبر من 18 سنة' : 'Over 18 years'
        };
        ageGroupCell.textContent = ageGroupText[patient.ageGroup];
        row.appendChild(ageGroupCell);

        // الجنس
        const genderCell = document.createElement('td');
        genderCell.textContent = patient.gender === 'M' ? (currentLang === 'ar' ? 'ذكر' : 'Male') : (currentLang === 'ar' ? 'أنثى' : 'Female');
        row.appendChild(genderCell);

        // نوع المرض
        const diseaseTypeCell = document.createElement('td');
        diseaseTypeCell.textContent = patient.diseaseType === 'communicable' ? (currentLang === 'ar' ? 'معدي' : 'Communicable') : (currentLang === 'ar' ? 'غير معدي' : 'Non-Communicable');
        row.appendChild(diseaseTypeCell);

        // تفاصيل الحالة
        const detailsCell = document.createElement('td');
        detailsCell.textContent = patient.otherDetails;
        row.appendChild(detailsCell);

        otherDetailsTableBody.appendChild(row);
    });
}

// تصدير إلى PDF
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // إضافة خط يدعم اللغة العربية
    doc.addFileToVFS('Amiri-Regular.ttf', 'https://cdn.jsdelivr.net/npm/@fontsource/amiri@4.5.0/files/amiri-regular.ttf');
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    doc.setFont('Amiri');

    // إعداد العنوان
    doc.setFontSize(16);
    doc.text(currentLang === 'ar' ? 'تقرير حالات المترددين - عيادة دير الحسي' : 'Patient Report - Deir Al-Hasi Clinic', currentLang === 'ar' ? 150 : 10, 10, { align: currentLang === 'ar' ? 'right' : 'left' });

    // تصدير الجداول الرئيسية
    const ageGroups = ['under-5', '5-18', 'over-18'];
    let yOffset = 20;

    ageGroups.forEach(ageGroup => {
        const table = document.getElementById(`reportTable-${ageGroup}`);
        const rows = table.querySelectorAll('tr');
        doc.setFontSize(12);
        doc.text(table.previousElementSibling.textContent, currentLang === 'ar' ? 150 : 10, yOffset, { align: currentLang === 'ar' ? 'right' : 'left' });
        yOffset += 10;

        const tableData = [];
        rows.forEach(row => {
            const cells = row.querySelectorAll('td, th');
            const rowData = [];
            cells.forEach(cell => rowData.push(cell.textContent));
            tableData.push(rowData);
        });

        doc.autoTable({
            startY: yOffset,
            head: [tableData[0], tableData[1]],
            body: tableData.slice(2),
            styles: { font: 'Amiri', fontSize: 10, halign: 'center', textColor: [0, 0, 0] },
            headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
            bodyStyles: { textColor: [0, 0, 0] },
            didDrawPage: (data) => {
                yOffset = data.cursor.y;
            }
        });

        yOffset += 10;
    });

    // تصدير جدول تفاصيل الحالات الأخرى
    const otherDetailsTable = document.getElementById('otherDetailsTable');
    const otherRows = otherDetailsTable.querySelectorAll('tr');
    doc.setFontSize(12);
    doc.text(currentLang === 'ar' ? 'تفاصيل الحالات الأخرى' : 'Other Cases Details', currentLang === 'ar' ? 150 : 10, yOffset, { align: currentLang === 'ar' ? 'right' : 'left' });
    yOffset += 10;

    const otherTableData = [];
    otherRows.forEach(row => {
        const cells = row.querySelectorAll('td, th');
        const rowData = [];
        cells.forEach(cell => rowData.push(cell.textContent));
        otherTableData.push(rowData);
    });

    doc.autoTable({
        startY: yOffset,
        head: [otherTableData[0]],
        body: otherTableData.slice(1),
        styles: { font: 'Amiri', fontSize: 10, halign: 'center', textColor: [0, 0, 0] },
        headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
        bodyStyles: { textColor: [0, 0, 0] }
    });

    doc.save('patient_report.pdf');
}

// تصدير إلى Excel
function exportToExcel() {
    const workbook = XLSX.utils.book_new();
    const ageGroups = ['under-5', '5-18', 'over-18'];

    ageGroups.forEach(ageGroup => {
        const table = document.getElementById(`reportTable-${ageGroup}`);
        const rows = table.querySelectorAll('tr');
        const sheetData = [];

        rows.forEach(row => {
            const cells = row.querySelectorAll('td, th');
            const rowData = [];
            cells.forEach(cell => rowData.push(cell.textContent));
            sheetData.push(rowData);
        });

        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, table.previousElementSibling.textContent);
    });

    // إضافة جدول تفاصيل الحالات الأخرى إلى Excel
    const otherDetailsTable = document.getElementById('otherDetailsTable');
    const otherRows = otherDetailsTable.querySelectorAll('tr');
    const otherSheetData = [];

    otherRows.forEach(row => {
        const cells = row.querySelectorAll('td, th');
        const rowData = [];
        cells.forEach(cell => rowData.push(cell.textContent));
        otherSheetData.push(rowData);
    });

    const otherWorksheet = XLSX.utils.aoa_to_sheet(otherSheetData);
    XLSX.utils.book_append_sheet(workbook, otherWorksheet, currentLang === 'ar' ? 'تفاصيل الحالات الأخرى' : 'Other Cases Details');

    XLSX.writeFile(workbook, 'patient_report.xlsx');
}

// تحديث التقرير عند تحميل الصفحة
window.onload = () => {
    updateReport();
    updateOtherDetailsTable();
    toggleLanguage(); // لضمان تحديث النصوص عند التحميل
};