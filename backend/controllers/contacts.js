export const getContacts = async (req, res) => {
    res.status(200).json({message: "Get All contacts"});
}

export const newContact = async (req, res, next) => {
    try {
        const {name, email, phone, designation} = req.body;
        if(!name || !email || !phone || !designation) {
            res.status(400);
            throw new Error("All fields are required"); 
        }
        res.status(201).json({message: "Create new contact"});
    } catch(err) {
        next(err);
    }
}

export const getContact = async (req, res) => {
    res.status(200).json({message: `Get contact ${req.params.id}`});
}

export const updateContact = async (req, res) => {
    res.status(200).json({message: `Update contact ${req.params.id}`});
}

export const deleteContact = async (req, res) => {
    res.status(200).json({message: `Delete contact ${req.params.id}`});
}
