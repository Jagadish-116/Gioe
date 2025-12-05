// DOM Elements
const form = document.getElementById('cvForm');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const progressBar = document.querySelector('.progress-bar');
const sections = document.querySelectorAll('.form-section');
const cvPreview = document.getElementById('cvPreview');
const cvActions = document.getElementById('cvActions');
const skipExperienceBtn = document.getElementById('skipExperience');

// Image Upload Elements
const profileImageInput = document.getElementById('profileImage');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const removeImageBtn = document.getElementById('removeImage');

// Template Selection Elements
const templateOptions = document.querySelectorAll('.template-option');
const selectedTemplateInput = document.getElementById('selectedTemplate');
const previewButtons = document.querySelectorAll('.preview-btn');
const templatePreviewModal = document.getElementById('templatePreviewModal');
const templatePreviewContent = document.getElementById('templatePreviewContent');
const closePreviewBtn = document.getElementById('closePreview');

let profileImageData = null;

// Add Education, Experience, and Skills buttons
const addEducationBtn = document.getElementById('addEducation');
const addExperienceBtn = document.getElementById('addExperience');
const addSkillsBtn = document.getElementById('addSkills');

// Current section tracker
let currentSection = 1;
const totalSections = sections.length;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    updateNavButtons();
    updateProgressBar();

    // Add direct click handler for submit button
    if (submitBtn) {
        console.log('Submit button found');
        submitBtn.addEventListener('click', (e) => {
            console.log('Submit button clicked');
            e.preventDefault();
            if (validateSection(currentSection)) {
                const formData = new FormData(form);
                generateCV(formData);
            }
        });
    } else {
        console.error('Submit button not found');
    }
});

// Navigation Functions
function updateNavButtons() {
    console.log('Updating nav buttons, current section:', currentSection);
    
    // Make sure we have references to all buttons
    if (!prevBtn || !nextBtn || !submitBtn) {
        console.error('Button references missing');
        return;
    }

    // Update button visibility and positioning
    if (currentSection === 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
        // Add margin-left auto to push the next button to the right
        nextBtn.classList.add('ml-auto');
    } else if (currentSection === totalSections) {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
        submitBtn.classList.remove('hidden');
        // Remove margin-left auto from next button
        nextBtn.classList.remove('ml-auto');
    } else {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
        // Remove margin-left auto from next button
        nextBtn.classList.remove('ml-auto');
    }
    
    console.log('Submit button display:', submitBtn.style.display);
}

function updateProgressBar() {
    const progress = ((currentSection - 1) / (totalSections - 1)) * 100;
    progressBar.style.width = `${progress}%`;
}

function showSection(sectionNumber) {
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionNumber}"]`).classList.add('active');
}

// Navigation Event Listeners
prevBtn.addEventListener('click', () => {
    if (currentSection > 1) {
        currentSection--;
        showSection(currentSection);
        updateNavButtons();
        updateProgressBar();
    }
});

nextBtn.addEventListener('click', () => {
    console.log('Next button clicked');
    if (validateSection(currentSection)) {
        if (currentSection < totalSections) {
            currentSection++;
            showSection(currentSection);
            updateNavButtons();
            updateProgressBar();
            console.log('Moved to section:', currentSection);
        }
    }
});

// Form Validation
function validateSection(sectionNumber) {
    console.log('Validating section:', sectionNumber);
    
    const currentSectionElement = document.querySelector(`[data-section="${sectionNumber}"]`);
    if (!currentSectionElement) {
        console.error('Section element not found:', sectionNumber);
        return false;
    }
    
    // For experience section (section 3), check if any field is filled
    if (sectionNumber === 3) {
        const inputs = currentSectionElement.querySelectorAll('input[type="text"], input[type="month"], textarea');
        let hasContent = false;
        let allFieldsFilled = true;
        
        inputs.forEach(input => {
            if (input.value.trim()) {
                hasContent = true;
            } else {
                allFieldsFilled = false;
            }
        });
        
        // If no fields are filled, section is optional
        if (!hasContent) {
            return true;
        }
        
        // If some fields are filled, all fields must be filled
        if (!allFieldsFilled) {
            alert('If adding work experience, please fill in all fields for each entry.');
            return false;
        }
        
        return true;
    }
    
    // For other sections, validate required fields
    const inputs = currentSectionElement.querySelectorAll('input[required], textarea[required]');
    console.log('Required inputs found:', inputs.length);
    
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('border-red-500');
            console.log('Invalid input:', input.name);
        } else {
            input.classList.remove('border-red-500');
        }
    });

    if (!isValid) {
        alert('Please fill in all required fields.');
    }
    
    console.log('Section validation result:', isValid);
    return isValid;
}

// Add More Entries Functions
function createEducationEntry() {
    const entry = document.createElement('div');
    entry.className = 'education-entry border-b pb-4 mb-4';
    entry.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="block text-gray-700 mb-2">Degree</label>
                <input type="text" name="degree[]" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" required>
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Institution</label>
                <input type="text" name="institution[]" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" required>
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Start Date</label>
                <input type="month" name="eduStartDate[]" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" required>
            </div>
            <div>
                <label class="block text-gray-700 mb-2">End Date</label>
                <input type="month" name="eduEndDate[]" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" required>
            </div>
            <div>
                <label class="block text-gray-700 mb-2">GPA</label>
                <input type="number" name="gpa[]" min="0" max="4" step="0.01" placeholder="e.g., 3.75" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" required>
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Class Rank <span class="text-gray-500 text-sm">(optional)</span></label>
                <input type="text" name="rank[]" placeholder="e.g., Top 5%" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400">
            </div>
        </div>
        <button type="button" class="remove-entry mt-2 text-red-600 hover:text-red-800">Remove</button>
    `;
    return entry;
}

function createExperienceEntry() {
    const entry = document.createElement('div');
    entry.className = 'experience-entry border-b pb-4 mb-4';
    entry.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="block text-gray-700 mb-2">Position <span class="text-gray-500 text-sm">(optional)</span></label>
                <input type="text" name="position[]" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400">
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Company <span class="text-gray-500 text-sm">(optional)</span></label>
                <input type="text" name="company[]" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400">
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Start Date <span class="text-gray-500 text-sm">(optional)</span></label>
                <input type="month" name="expStartDate[]" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400">
            </div>
            <div>
                <label class="block text-gray-700 mb-2">End Date <span class="text-gray-500 text-sm">(optional)</span></label>
                <input type="month" name="expEndDate[]" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400">
            </div>
            <div class="md:col-span-2">
                <label class="block text-gray-700 mb-2">Responsibilities <span class="text-gray-500 text-sm">(optional)</span></label>
                <textarea name="responsibilities[]" rows="3" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"></textarea>
            </div>
        </div>
        <button type="button" class="remove-entry mt-2 text-red-600 hover:text-red-800">Remove</button>
    `;
    return entry;
}

function createSkillsEntry() {
    const entry = document.createElement('div');
    entry.className = 'skills-entry mb-4';
    entry.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label class="block text-gray-700 mb-2">Skill Category</label>
                <input type="text" name="skillCategory[]" placeholder="e.g., Programming Languages" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" required>
            </div>
            <div>
                <label class="block text-gray-700 mb-2">Skills</label>
                <input type="text" name="skills[]" placeholder="e.g., Python, JavaScript, Java" class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400" required>
            </div>
        </div>
        <button type="button" class="remove-entry mt-2 text-red-600 hover:text-red-800">Remove</button>
    `;
    return entry;
}

// Add Entry Event Listeners
addEducationBtn.addEventListener('click', () => {
    const container = document.getElementById('educationContainer');
    container.appendChild(createEducationEntry());
});

addExperienceBtn.addEventListener('click', () => {
    const container = document.getElementById('experienceContainer');
    container.appendChild(createExperienceEntry());
});

addSkillsBtn.addEventListener('click', () => {
    const container = document.getElementById('skillsContainer');
    container.appendChild(createSkillsEntry());
});

// Remove Entry Event Delegation
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-entry')) {
        e.target.parentElement.remove();
    }
});

// Add form validation
function validateForm(formData) {
    const errors = [];
    
    // Validate email
    const email = formData.get('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
    }

    // Validate phone (optional)
    const phone = formData.get('phone');
    if (phone) {
        const phoneRegex = /^[+]?[\d\s-()]+$/;
        if (!phoneRegex.test(phone)) {
            errors.push('Please enter a valid phone number');
        }
    }

    // Validate GPA values (now mandatory)
    const gpas = formData.getAll('gpa[]');
    const degrees = formData.getAll('degree[]');
    
    degrees.forEach((degree, index) => {
        if (degree.trim()) {  // If there's a degree entry
            const gpa = gpas[index];
            if (!gpa) {
                errors.push(`GPA is required for education entry ${index + 1}`);
            } else {
                const gpaNum = parseFloat(gpa);
                if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4) {
                    errors.push(`GPA at entry ${index + 1} must be between 0 and 4`);
                }
            }
        }
    });

    // Validate dates
    const validateDate = (date, fieldName, index) => {
        if (date) {
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                errors.push(`Invalid ${fieldName} at entry ${index + 1}`);
            }
        }
    };

    // Validate education dates
    const eduStartDates = formData.getAll('eduStartDate[]');
    const eduEndDates = formData.getAll('eduEndDate[]');
    eduStartDates.forEach((date, i) => validateDate(date, 'education start date', i + 1));
    eduEndDates.forEach((date, i) => validateDate(date, 'education end date', i + 1));

    // Validate experience dates (only if provided)
    const expStartDates = formData.getAll('expStartDate[]');
    const expEndDates = formData.getAll('expEndDate[]');
    expStartDates.forEach((date, i) => {
        if (date) validateDate(date, 'experience start date', i + 1);
    });
    expEndDates.forEach((date, i) => {
        if (date) validateDate(date, 'experience end date', i + 1);
    });

    return errors;
}

// Update form submission handler
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    
    // Validate form
    const errors = validateForm(formData);
    if (errors.length > 0) {
        alert('Please correct the following errors:\n\n' + errors.join('\n'));
        return;
    }

    generateCV(formData);
});

// Image Upload Handling
profileImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            profileImageInput.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            profileImageData = e.target.result;
            previewImg.src = profileImageData;
            imagePreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
});

removeImageBtn.addEventListener('click', () => {
    profileImageData = null;
    profileImageInput.value = '';
    imagePreview.classList.add('hidden');
});

// Template Selection and Preview
templateOptions.forEach(option => {
    const previewBtn = option.querySelector('.preview-btn');
    const template = option.dataset.template;

    // Template selection
    option.addEventListener('click', (e) => {
        if (e.target.classList.contains('preview-btn')) return;
        
        templateOptions.forEach(opt => {
            opt.querySelector('.template-preview').classList.remove('border-indigo-500');
            opt.querySelector('.template-preview').classList.add('border-gray-200');
        });

        option.querySelector('.template-preview').classList.remove('border-gray-200');
        option.querySelector('.template-preview').classList.add('border-indigo-500');
        selectedTemplateInput.value = template;
    });

    // Template preview
    previewBtn.addEventListener('click', () => {
        showTemplatePreview(template);
    });
});

// Close preview modal
closePreviewBtn.addEventListener('click', () => {
    templatePreviewModal.classList.add('hidden');
});

// Close modal when clicking outside
templatePreviewModal.addEventListener('click', (e) => {
    if (e.target === templatePreviewModal) {
        templatePreviewModal.classList.add('hidden');
    }
});

function showTemplatePreview(template) {
    const sampleData = {
        personal: {
            fullName: 'John Doe',
            email: 'john@example.com',
            phone: '+1 234 567 890',
            location: 'New York, USA',
            summary: 'Experienced professional with expertise in...',
            profileImage: 'https://i.imgur.com/sample-profile.jpg'
        },
        education: [{
            degree: 'Bachelor of Science in Computer Science',
            institution: 'Sample University',
            startDate: '2016-09',
            endDate: '2020-05'
        }],
        experience: [{
            position: 'Senior Developer',
            company: 'Tech Company',
            startDate: '2020-06',
            endDate: '2023-12',
            responsibilities: 'Led development team, implemented new features...'
        }],
        skills: [{
            category: 'Programming Languages',
            skills: 'JavaScript, Python, Java'
        }]
    };

    const previewHTML = templates[template].generateHTML(sampleData);
    templatePreviewContent.innerHTML = previewHTML;
    templatePreviewModal.classList.remove('hidden');
}

// Template Definitions
const templates = {
    modern: {
        generateHTML: (data) => `
            <div class="cv-content max-w-4xl mx-auto p-8">
                <!-- Header -->
                <div class="flex items-center border-b-2 border-indigo-500 pb-6 mb-6">
                    ${data.personal.profileImage ? `
                        <div class="mr-8">
                            <img src="${data.personal.profileImage}" alt="Profile" class="w-36 h-36 rounded-full object-cover border-2 border-indigo-500">
                        </div>
                    ` : ''}
                    <div class="flex-1">
                        <h1 class="text-4xl font-bold text-indigo-600 mb-4">${data.personal.fullName}</h1>
                        <div class="text-gray-600 flex flex-wrap gap-6">
                            <p class="flex items-center"><i class="fas fa-envelope mr-2"></i> ${data.personal.email}</p>
                            <p class="flex items-center"><i class="fas fa-phone mr-2"></i> ${data.personal.phone}</p>
                            <p class="flex items-center"><i class="fas fa-map-marker-alt mr-2"></i> ${data.personal.location}</p>
                        </div>
                    </div>
                </div>

                <!-- Professional Summary -->
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-indigo-600 mb-4 border-b-2 border-gray-200 pb-2">About Me</h2>
                    <p class="text-gray-700 whitespace-pre-line leading-relaxed px-1">${data.personal.summary}</p>
                </div>

                <!-- Education -->
                ${data.education.length > 0 ? `
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-indigo-600 mb-5 border-b-2 border-gray-200 pb-2">Education Background</h2>
                    ${data.education.map(edu => `
                        <div class="mb-6 bg-gray-50 p-6 rounded-lg shadow-sm">
                            <div class="flex justify-between items-baseline mb-3">
                                <h3 class="font-bold text-xl text-gray-800">${edu.degree}</h3>
                                <p class="text-gray-600">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</p>
                            </div>
                            <p class="text-indigo-600 font-semibold mb-2">${edu.institution}</p>
                            ${(edu.gpa || edu.rank) ? `
                                <div class="text-gray-700 mt-2">
                                    ${edu.gpa ? `<p class="text-sm">GPA: ${edu.gpa}</p>` : ''}
                                    ${edu.rank ? `<p class="text-sm">Class Rank: ${edu.rank}</p>` : ''}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                <!-- Experience -->
                ${data.experience.length > 0 ? `
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-indigo-600 mb-5 border-b-2 border-gray-200 pb-2">Professional Journey</h2>
                    ${data.experience.map(exp => `
                        <div class="mb-6 bg-gray-50 p-6 rounded-lg shadow-sm">
                            <div class="flex justify-between items-baseline mb-3">
                                <h3 class="font-bold text-xl text-gray-800">${exp.position}</h3>
                                ${exp.startDate || exp.endDate ? `
                                    <p class="text-gray-600">
                                        ${exp.startDate ? formatDate(exp.startDate) : ''} 
                                        ${exp.startDate && exp.endDate ? ' - ' : ''} 
                                        ${exp.endDate ? formatDate(exp.endDate) : ''}
                                    </p>
                                ` : ''}
                            </div>
                            ${exp.company ? `<p class="text-indigo-600 font-semibold mb-4">${exp.company}</p>` : ''}
                            ${exp.responsibilities ? `
                                <p class="font-medium text-gray-700 mb-3">Key Responsibilities:</p>
                                <p class="text-gray-700 whitespace-pre-line pl-6 leading-relaxed">${exp.responsibilities}</p>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                <!-- Skills -->
                ${data.skills.length > 0 ? `
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-indigo-600 mb-5 border-b-2 border-gray-200 pb-2">Professional Skills</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${data.skills.map(skill => `
                        <div class="bg-gray-50 p-6 rounded-lg shadow-sm">
                            <h3 class="font-bold text-xl text-gray-800 mb-3">${skill.category}</h3>
                            <p class="text-gray-600 leading-relaxed">${skill.skills}</p>
                        </div>
                    `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `
    },
    classic: {
        generateHTML: (data) => `
            <div class="cv-content max-w-4xl mx-auto p-8 font-serif">
                <!-- Header -->
                <div class="text-center border-b-2 border-gray-800 pb-6 mb-6">
                    ${data.personal.profileImage ? `
                        <div class="mb-4">
                            <img src="${data.personal.profileImage}" alt="Profile" class="w-36 h-36 rounded-full object-cover mx-auto border-2 border-gray-800">
                        </div>
                    ` : ''}
                    <h1 class="text-4xl font-bold text-gray-800 mb-4">${data.personal.fullName}</h1>
                    <div class="text-gray-600 space-y-2">
                        <p>Email: ${data.personal.email} | Phone: ${data.personal.phone}</p>
                        <p>Location: ${data.personal.location}</p>
                    </div>
                </div>

                <!-- Professional Summary -->
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center uppercase tracking-wide border-b-2 border-gray-300 pb-2">About Me</h2>
                    <p class="text-gray-700 whitespace-pre-line text-justify leading-relaxed px-1">${data.personal.summary}</p>
                </div>

                <!-- Education -->
                ${data.education.length > 0 ? `
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-800 mb-5 text-center uppercase tracking-wide border-b-2 border-gray-300 pb-2">Education Background</h2>
                    ${data.education.map(edu => `
                        <div class="mb-6 pb-6 border-b border-gray-200">
                            <div class="flex justify-between items-baseline mb-3">
                                <h3 class="font-bold text-xl text-gray-800">Qualification: ${edu.degree}</h3>
                                <p class="text-gray-600">Period: ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</p>
                            </div>
                            <p class="font-semibold text-gray-700">Institution: ${edu.institution}</p>
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                <!-- Skills -->
                ${data.skills.length > 0 ? `
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-800 mb-5 text-center uppercase tracking-wide border-b-2 border-gray-300 pb-2">Professional Skills</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${data.skills.map(skill => `
                        <div class="text-center p-6 border border-gray-200 rounded">
                            <h3 class="font-bold text-xl text-gray-800 mb-3">Area: ${skill.category}</h3>
                            <p class="text-gray-600 leading-relaxed">Competencies: ${skill.skills}</p>
                        </div>
                    `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- Experience -->
                ${data.experience.length > 0 ? `
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-800 mb-5 text-center uppercase tracking-wide border-b-2 border-gray-300 pb-2">Professional Journey</h2>
                    ${data.experience.map(exp => `
                        <div class="mb-6 pb-6 border-b border-gray-200">
                            <div class="flex justify-between items-baseline mb-3">
                                <h3 class="font-bold text-xl text-gray-800">Role: ${exp.position}</h3>
                                <p class="text-gray-600">Period: ${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}</p>
                            </div>
                            <p class="font-semibold text-gray-700 mb-4">Organization: ${exp.company}</p>
                            <p class="font-medium text-gray-800 mb-3">Responsibilities & Achievements:</p>
                            <p class="text-gray-700 whitespace-pre-line pl-6 leading-relaxed">${exp.responsibilities}</p>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
        `
    },
    creative: {
        generateHTML: (data) => `
            <div class="cv-content max-w-4xl mx-auto p-8 bg-gradient-to-br from-purple-50 to-white">
                <!-- Header -->
                <div class="relative pb-6 mb-6 flex items-center">
                    ${data.personal.profileImage ? `
                        <div class="mr-8">
                            <img src="${data.personal.profileImage}" alt="Profile" class="w-40 h-40 rounded-full object-cover ring-4 ring-purple-400 shadow-lg">
                        </div>
                    ` : ''}
                    <div class="flex-1">
                        <h1 class="text-5xl font-bold text-purple-600 mb-4">${data.personal.fullName}</h1>
                        <div class="text-gray-600 flex flex-wrap gap-4">
                            <p class="bg-purple-100 px-4 py-2 rounded-full shadow-sm"><span class="font-medium">Email:</span> ${data.personal.email}</p>
                            <p class="bg-purple-100 px-4 py-2 rounded-full shadow-sm"><span class="font-medium">Phone:</span> ${data.personal.phone}</p>
                            <p class="bg-purple-100 px-4 py-2 rounded-full shadow-sm"><span class="font-medium">Location:</span> ${data.personal.location}</p>
                        </div>
                    </div>
                </div>

                <!-- Professional Summary -->
                <div class="mb-6">
                    <h2 class="text-3xl font-bold text-purple-600 mb-4">About Me</h2>
                    <div class="bg-white p-6 rounded-lg shadow-sm">
                        <p class="text-gray-700 whitespace-pre-line leading-relaxed">${data.personal.summary}</p>
                    </div>
                </div>

                <!-- Education -->
                ${data.education.length > 0 ? `
                <div class="mb-6">
                    <h2 class="text-3xl font-bold text-purple-600 mb-5">Education Background</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${data.education.map(edu => `
                        <div class="bg-white p-6 rounded-lg shadow-sm transform transition-all duration-200 hover:shadow-md">
                            <h3 class="font-bold text-xl text-purple-600 mb-3">Degree: ${edu.degree}</h3>
                            <p class="text-gray-800 font-semibold mb-3">Institution: ${edu.institution}</p>
                            <p class="text-purple-400">Duration: ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</p>
                        </div>
                    `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- Skills -->
                ${data.skills.length > 0 ? `
                <div class="mb-6">
                    <h2 class="text-3xl font-bold text-purple-600 mb-5">Professional Skills</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${data.skills.map(skill => `
                        <div class="bg-white p-6 rounded-lg shadow-sm transform transition-all duration-200 hover:shadow-md">
                            <h3 class="font-bold text-xl text-purple-600 mb-3">Expertise Area: ${skill.category}</h3>
                            <p class="text-gray-700 leading-relaxed">Key Skills: ${skill.skills}</p>
                        </div>
                    `).join('')}
                    </div>
                </div>
                ` : ''}

                <!-- Experience -->
                ${data.experience.length > 0 ? `
                <div class="mb-6">
                    <h2 class="text-3xl font-bold text-purple-600 mb-5">Professional Journey</h2>
                    ${data.experience.map(exp => `
                        <div class="mb-6 bg-white p-6 rounded-lg shadow-sm transform transition-all duration-200 hover:shadow-md">
                            <h3 class="font-bold text-2xl text-purple-600 mb-3">Position: ${exp.position}</h3>
                            <p class="text-gray-800 font-semibold mb-3">Company: ${exp.company}</p>
                            <p class="text-purple-400 text-sm mb-3">Timeline: ${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}</p>
                            <p class="font-medium text-gray-800 mb-3">Key Responsibilities & Achievements:</p>
                            <p class="text-gray-700 whitespace-pre-line pl-6 leading-relaxed">${exp.responsibilities}</p>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
        `
    }
};

// Update generateCV function to include profile image
function generateCV(formData) {
    try {
        console.log('Starting CV generation');
        
        // Get selected template
        const selectedTemplate = selectedTemplateInput.value || 'modern';
        
        // Create data object with profile image
        const data = {
            personal: {
                fullName: formData.get('fullName') || '',
                email: formData.get('email') || '',
                phone: formData.get('phone') || '',
                location: formData.get('location') || '',
                summary: formData.get('summary') || '',
                profileImage: profileImageData
            },
            education: [],
            experience: [],
            skills: []
        };
        
        console.log('Personal data:', data.personal);

        // Get education entries
        const degrees = formData.getAll('degree[]');
        const institutions = formData.getAll('institution[]');
        const eduStartDates = formData.getAll('eduStartDate[]');
        const eduEndDates = formData.getAll('eduEndDate[]');
        const gpas = formData.getAll('gpa[]');
        const ranks = formData.getAll('rank[]');

        for (let i = 0; i < degrees.length; i++) {
            if (degrees[i].trim()) {
                data.education.push({
                    degree: degrees[i],
                    institution: institutions[i],
                    startDate: eduStartDates[i],
                    endDate: eduEndDates[i],
                    gpa: gpas[i] || null,
                    rank: ranks[i] || null
                });
            }
        }
        
        console.log('Education data:', data.education);

        // Get experience entries
        const positions = formData.getAll('position[]');
        const companies = formData.getAll('company[]');
        const expStartDates = formData.getAll('expStartDate[]');
        const expEndDates = formData.getAll('expEndDate[]');
        const responsibilities = formData.getAll('responsibilities[]');

        for (let i = 0; i < positions.length; i++) {
            // Only add experience if at least position or company is provided
            if (positions[i].trim() || companies[i].trim()) {
                data.experience.push({
                    position: positions[i],
                    company: companies[i],
                    startDate: expStartDates[i] || '',
                    endDate: expEndDates[i] || '',
                    responsibilities: responsibilities[i] || ''
                });
            }
        }
        
        console.log('Experience data:', data.experience);

        // Get skills entries
        const skillCategories = formData.getAll('skillCategory[]');
        const skills = formData.getAll('skills[]');

        for (let i = 0; i < skillCategories.length; i++) {
            if (skillCategories[i].trim()) {
                data.skills.push({
                    category: skillCategories[i],
                    skills: skills[i]
                });
            }
        }
        
        console.log('Skills data:', data.skills);

        // Generate CV HTML using selected template
        const cvHTML = templates[selectedTemplate].generateHTML(data);

        // Show CV preview
        cvPreview.innerHTML = cvHTML;
        cvPreview.classList.remove('hidden');
        cvActions.classList.remove('hidden');
        form.parentElement.classList.add('hidden');

        console.log('CV generation completed successfully');
    } catch (error) {
        console.error('Error in CV generation:', error);
        alert('There was an error generating your CV. Please try again.');
    }
}

// Helper Functions
function formatDate(dateString) {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function editCV() {
    cvPreview.classList.add('hidden');
    cvActions.classList.add('hidden');
    form.parentElement.classList.remove('hidden');
}

// Skip Experience Section
skipExperienceBtn.addEventListener('click', () => {
    // Clear all experience inputs
    const experienceContainer = document.getElementById('experienceContainer');
    const inputs = experienceContainer.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.value = '';
    });
    
    // Remove any additional experience entries except the first one
    const entries = experienceContainer.querySelectorAll('.experience-entry');
    for (let i = 1; i < entries.length; i++) {
        entries[i].remove();
    }
    
    // Move to skills section
    currentSection = 4;
    showSection(currentSection);
    updateNavButtons();
    updateProgressBar();
});