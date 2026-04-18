const supabase = require('../Config/supabase');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.PersonalInfoSave = catchAsync(async (req, res, next) => {
  const {
    Token,
    FirstName,
    MiddleName,
    LastName,
    DateOfBirth,
    FatherName,
    Gender,
    MaritalStatus,
    AadharNo,
    PanCard,
    MobileNo,
    Email,
    Address,
    City,
    selectedState,
    PinCode,
  } = req.body;

  // Check if a document with the given email exists
  const { data: existingInfo, error: selectError } = await supabase
    .from('personal_info')
    .select('*')
    .eq('email', Email)
    .limit(1)
    .single();

  const newData = {
    token: Token,
    first_name: FirstName,
    middle_name: MiddleName,
    last_name: LastName,
    date_of_birth: DateOfBirth,
    father_name: FatherName,
    gender: Gender,
    marital_status: MaritalStatus,
    aadhaar_no: AadharNo,
    pan_card: PanCard,
    mobile_no: MobileNo,
    email: Email,
    address: Address,
    city: City,
    state: selectedState,
    pin_code: PinCode,
  };

  if (existingInfo) {
    // Check if there's any change in the values
    const hasChanged =
      FirstName !== existingInfo.first_name ||
      MiddleName !== existingInfo.middle_name ||
      LastName !== existingInfo.last_name ||
      DateOfBirth !== existingInfo.date_of_birth ||
      FatherName !== existingInfo.father_name ||
      Gender !== existingInfo.gender ||
      MaritalStatus !== existingInfo.marital_status ||
      PanCard !== existingInfo.pan_card ||
      MobileNo !== existingInfo.mobile_no ||
      Address !== existingInfo.address ||
      City !== existingInfo.city ||
      selectedState !== existingInfo.state ||
      PinCode !== existingInfo.pin_code;

    if (hasChanged) {
      // Update existing record
      const { data: updatedInfo, error: updateError } = await supabase
        .from('personal_info')
        .update(newData)
        .eq('email', Email)
        .select()
        .single();

      if (updateError || !updatedInfo) {
        throw new AppError('Failed to update personal info', 500);
      }

      console.log("Personal Info Updated:", updatedInfo);
      res.status(200).json({ id: updatedInfo.id });
    } else {
      // If there are no changes, return the existing record's ID
      res.status(200).json({ id: existingInfo.id });
    }
  } else {
    // Create a new record
    const { data: newInfo, error: insertError } = await supabase
      .from('personal_info')
      .insert([newData])
      .select()
      .single();

    if (insertError || !newInfo) {
      throw new AppError('Failed to save personal info', 500);
    }

    res.status(201).json({ id: newInfo.id, newInfo });
  }
});

exports.PersonalInfoAccess = catchAsync(async (req, res, next) => {
  const { Email } = req.body;
  
  const { data: pbody, error } = await supabase
    .from('personal_info')
    .select('*')
    .eq('email', Email)
    .limit(1)
    .single();

  if (!pbody || error) {
    throw new AppError('No data found for the provided Email', 404);
  }

  res.status(200).json(pbody);
});