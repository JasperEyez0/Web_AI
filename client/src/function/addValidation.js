import check from "lodash";

function addValidation(values) {

    let error = {}

    if (values.firstName === "") {
        error.firstName = "First name should not be empty"
    } else {
        error.firstName = ""
    }

    if (values.lastName === "") {
        error.lastName = "Last name should not be empty"
    } else {
        error.lastName = ""
    }

    if (values.studentId === "") {
        error.studentId = "Student ID should not be empty"
    } else {
        error.studentId = ""
    }

    if (values.birthDate === "") {
        error.birthDate = "Birth date should not be empty"
    } else {
        error.birthDate = ""
    }

    if (values.gender === "") {
        error.gender = "Gender should not be empty"
    } else {
        error.gender = ""
    }

    if (values.pic ==="") {
        error.pic = "Picture should not be empty"
    }

    return error;
}

export default addValidation;