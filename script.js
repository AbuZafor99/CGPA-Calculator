document.addEventListener('DOMContentLoaded', () => {
    const universitySelect = document.getElementById('university');
    const cgpaForm = document.getElementById('cgpaForm');
    const coursesContainer = document.getElementById('coursesContainer');
    const addCourseButton = document.getElementById('addCourse');
    const resultDiv = document.getElementById('result');
    const body = document.body;

    // Set an initial background image
    body.style.backgroundImage = "url('./images/basic.jpg')"; // Replace with your default image path
    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center";
    body.style.backgroundRepeat = "no-repeat";

    // Function to change background based on university selection
    universitySelect.addEventListener('change', function () {
        const selectedUniversity = universitySelect.value;

        if (selectedUniversity === 'IUB') {
            body.style.backgroundImage = "url('./images/iub.jpg')";
        } else if (selectedUniversity === 'NSU') {
            body.style.backgroundImage = "url('./images/nsu.jpg')";
        } else if (selectedUniversity === 'AIUB') {
            body.style.backgroundImage = "url('./images/aiub.jpg')";
        } else {
            body.style.backgroundImage = "url('./images/basic.jpg')"; // Reset to default if no selection
        }

        // Ensure background properties are applied
        body.style.backgroundSize = "cover";
        body.style.backgroundPosition = "center";
        body.style.backgroundRepeat = "no-repeat";
    });

    // Function to create a course row
    function createCourseRow() {
        const courseDiv = document.createElement('div');
        courseDiv.classList.add('course');

        courseDiv.innerHTML = `
            <input type="number" class="courseCredit" placeholder="Credits" required>
            <select class="gradeType">
                <option value="cg" selected>CG</option>
                <option value="num">Number</option>
            </select>
            <div class="gradeInputContainer">
                <select class="courseGrade cgGrade">
                    <option value="4.0">A</option>
                    <option value="3.7">A-</option>
                    <option value="3.3">B+</option>
                    <option value="3.0">B</option>
                    <option value="2.7">B-</option>
                    <option value="2.3">C+</option>
                    <option value="2.0">C</option>
                    <option value="1.7">C-</option>
                    <option value="1.3">D+</option>
                    <option value="1.0">D</option>
                    <option value="0.0">F</option>
                </select>
                <input type="number" class="courseGrade numGrade" placeholder="Grade" step="0.01" style="display: none;" required>
            </div>
            <button type="button" class="removeCourse" aria-label="Remove course">&times;</button>
        `;

        // Add event listener to the "Remove" button
        const removeButton = courseDiv.querySelector('.removeCourse');
        removeButton.addEventListener('click', () => {
            coursesContainer.removeChild(courseDiv);
        });

        // Add event listener to toggle between grade input types
        const gradeTypeSelect = courseDiv.querySelector('.gradeType');
        const numGradeInput = courseDiv.querySelector('.numGrade');
        const cgGradeDropdown = courseDiv.querySelector('.cgGrade');

        // Set the default visibility based on the default selected option (CG)
        if (gradeTypeSelect.value === 'cg') {
            numGradeInput.style.display = 'none';
            cgGradeDropdown.style.display = 'block';
            numGradeInput.required = false;
            cgGradeDropdown.required = true;
        }

        gradeTypeSelect.addEventListener('change', () => {
            if (gradeTypeSelect.value === 'num') {
                numGradeInput.style.display = 'block';
                cgGradeDropdown.style.display = 'none';
                numGradeInput.required = true;
                cgGradeDropdown.required = false;
            } else if (gradeTypeSelect.value === 'cg') {
                numGradeInput.style.display = 'none';
                cgGradeDropdown.style.display = 'block';
                numGradeInput.required = false;
                cgGradeDropdown.required = true;
            }
        });

        coursesContainer.appendChild(courseDiv);

        // Show the remove button only if there are more than one course rows
        updateRemoveButtons();
    }

    // Function to update the visibility of remove buttons
    function updateRemoveButtons() {
        const courseRows = coursesContainer.querySelectorAll('.course');
        courseRows.forEach((row, index) => {
            const removeButton = row.querySelector('.removeCourse');
            removeButton.style.display = courseRows.length > 1 ? 'inline-block' : 'none';
        });
    }

    // Create only one course row on page load
    coursesContainer.innerHTML = ''; // Clear any pre-existing rows
    createCourseRow();

    // Add a new course row when the "Add Course" button is clicked
    addCourseButton.addEventListener('click', createCourseRow);

    // CGPA Calculation
    cgpaForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const university = document.getElementById("university").value;
        const currentCg = parseFloat(document.getElementById("currentCg").value) || 0;
        const completedCredits = parseFloat(document.getElementById("completedCredits").value) || 0;

        const courses = Array.from(document.querySelectorAll("#coursesContainer .course"));
        let totalCredits = completedCredits;
        let totalGradePoints = currentCg * completedCredits;

        courses.forEach(course => {
            const credits = parseFloat(course.querySelector(".courseCredit").value);
            const gradeType = course.querySelector(".gradeType").value;
            let grade;

            if (gradeType === "num") {
                const numGrade = parseFloat(course.querySelector(".numGrade").value);
                if (university === "IUB") {
                    grade = convertNumberToCGPA_IUB(numGrade); // Convert numerical grade to CGPA for IUB
                } else if (university === "NSU") {
                    grade = convertNumberToCGPA_NSU(numGrade); // Convert numerical grade to CGPA for NSU
                } else if (university === "AIUB") {
                    grade = convertNumberToCGPA_AIUB(numGrade); // Convert numerical grade to CGPA for AIUB
                }
            } else if (gradeType === "cg") {
                grade = parseFloat(course.querySelector(".cgGrade").value); // Use selected CGPA value
            }

            totalCredits += credits;
            totalGradePoints += credits * grade;
        });

        const cgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;

        if (isNaN(cgpa) || cgpa < 0 || cgpa > 4) {
            document.getElementById("errorMessage").textContent = "Invalid input. Please check your grades and credits.";
            document.getElementById("cgpaOutput").textContent = "";
        } else {
            document.getElementById("errorMessage").textContent = "";
            document.getElementById("cgpaOutput").textContent = `Your CGPA is: ${cgpa}`;
        }
    });

    function convertNumberToCGPA_NSU(numberGrade) {
        if (numberGrade >= 93) return 4.0; // A
        if (numberGrade >= 90 && numberGrade <= 92) return 3.7; // A-
        if (numberGrade >= 87 && numberGrade <= 89) return 3.3; // B+
        if (numberGrade >= 83 && numberGrade <= 86) return 3.0; // B
        if (numberGrade >= 80 && numberGrade <= 82) return 2.7; // B-
        if (numberGrade >= 77 && numberGrade <= 79) return 2.3; // C+
        if (numberGrade >= 73 && numberGrade <= 76) return 2.0; // C
        if (numberGrade >= 70 && numberGrade <= 72) return 1.7; // C-
        if (numberGrade >= 67 && numberGrade <= 69) return 1.3; // D+
        if (numberGrade >= 60 && numberGrade <= 66) return 1.0; // D
        if (numberGrade < 60) return 0.0; // F
        return 0.0; // Default for invalid grades
    }

    function convertNumberToCGPA_IUB(numberGrade) {
        if (numberGrade >= 90) return 4.0; // A
        if (numberGrade >= 85 && numberGrade <= 89) return 3.7; // A-
        if (numberGrade >= 80 && numberGrade <= 84) return 3.3; // B+
        if (numberGrade >= 75 && numberGrade <= 79) return 3.0; // B
        if (numberGrade >= 70 && numberGrade <= 74) return 2.7; // B-
        if (numberGrade >= 65 && numberGrade <= 69) return 2.3; // C+
        if (numberGrade >= 60 && numberGrade <= 64) return 2.0; // C
        if (numberGrade >= 55 && numberGrade <= 59) return 1.7; // C-
        if (numberGrade >= 50 && numberGrade <= 54) return 1.3; // D+
        if (numberGrade >= 45 && numberGrade <= 49) return 1.0; // D
        if (numberGrade < 45) return 0.0; // F
        return 0.0; // Default for invalid grades
    }

    function convertNumberToCGPA_AIUB(numberGrade) {
        if (numberGrade >= 90) return 4.0; // A+
        if (numberGrade >= 85 && numberGrade < 90) return 3.75; // A
        if (numberGrade >= 80 && numberGrade < 85) return 3.5; // B+
        if (numberGrade >= 75 && numberGrade < 80) return 3.25; // B
        if (numberGrade >= 70 && numberGrade < 75) return 3.0; // C+
        if (numberGrade >= 65 && numberGrade < 70) return 2.75; // C
        if (numberGrade >= 60 && numberGrade < 65) return 2.5; // D+
        if (numberGrade >= 50 && numberGrade < 60) return 2.25; // D
        if (numberGrade < 50) return 0.0; // F
        return 0.0; // Default for invalid grades
    }
});
