
const Department = require('../models/department');

module.exports.index = async (req, res) => {
    const departments = await Department.find({});
    res.render('departments/index', { departments })
}

module.exports.renderNewForm = (req, res) => {
    res.render('departments/new');
}

module.exports.createDepartment = async (req, res, next) => {
    let departmentBody = req.body.department
    const department = new Department({ ...departmentBody  });
    await department.save();
    req.flash('success', 'Department creat correctament!');
    res.status(201).json(department)
}

module.exports.showDepartment =  async (req, res, next) => {
    const { user } = req
    const department = await Department.findById(req.params.id)
    
    if (!department) {
        req.flash('error', "No es pot trobar el department!");
        return res.redirect('/departments');
    }
    res.render('departments/show', { department, isAdmin: user.isAdmin });
}

module.exports.getDepartments =  async (req, res, next) => {
    const departments = await Department.find()
    
    if (!departments) {
        req.flash('error', "No es poden trobar departments!");
        return
    }
    res.json(departments)
}

module.exports.renderEditForm = async (req, res) => {
    const department = await Department.findById(req.params.id);
    if (!department) {
        req.flash('error', "No es pot trobar el department!");
        return res.redirect('/departments');
    }
    res.render('departments/edit', { department });
}

module.exports.updateDepartment = async (req, res) => {
    const { id } = req.params;

    const department = await Department.findByIdAndUpdate(id, { ...req.body.department });
    req.flash('success', 'Department actualitzat correctament!')
    res.redirect(`/departments/${department._id}`);
}

module.exports.deleteDepartment = async (req, res) => {
    const { id } = req.params;
    await Department.findByIdAndDelete(id);
    req.flash('success', 'Department eliminat correctament!');
    res.redirect('/departments');
}

