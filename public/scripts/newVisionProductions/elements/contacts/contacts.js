NV.contacts = function ($parent) {
    var nv = this,
        global = nv.global,
        a9 = global.A9,
        eventOnPointerEnd = a9.deviceInfo.eventOnPointerEnd,
        tp = global.cnCt.tp,
        settings = nv.settings,
        $fragment,
        $button,
        feedbackData = {},
        $feedbackForm,
        build;


    function validateForm(feedbackFormData) {


        var isValid = true;

        if (feedbackFormData.customerName.value == '') {
            feedbackFormData.customerName.style.border = '1px solid red';
            isValid = false;
        }
        else {
            feedbackFormData.customerName.style.border = 'none';
        }

        if (feedbackFormData.email.value == '') {
            feedbackFormData.email.style.border = '1px solid red';
            isValid = false;
        }
        else {
            feedbackFormData.email.style.border = 'none';
        }

        if (!a9.validation.validators.email(feedbackFormData.email.value)) {
            feedbackFormData.email.style.border = '1px solid red';
            isValid = false;
        }
        else {
            feedbackFormData.email.style.border = 'none';
        }

        if (feedbackFormData.antiSpam.value == '') {
            feedbackFormData.antiSpam.style.border = '1px solid red';
            isValid = false;
        }
        else {
            feedbackFormData.antiSpam.style.border = 'none';
        }

        if (feedbackFormData.antiSpam.value != settings.controlsDescriptors.site.antiSpamAnswer) {
            feedbackFormData.antiSpam.style.border = '1px solid red';
            isValid = false;
        }
        else {
            feedbackFormData.antiSpam.style.border = 'none';
        }

        if (feedbackFormData.question.value == '') {
            feedbackFormData.question.style.border = '1px solid red';
            isValid = false;
        }
        else {
            feedbackFormData.question.style.border = 'none';
        }



        return isValid;
    }

    function submit() {

        var isValidForm = validateForm(feedbackData);

        if (isValidForm) {
            $feedbackForm.style.display = 'none';

            a9.request({
                method: 'POST',
                postData: {
                    name: feedbackData.customerName.value,
                    email: feedbackData.email.value,
                    question:feedbackData.question.value
                },
                url: '/feedback',
                onSuccess: function (success) {
                    $fragment = global.document.createDocumentFragment();
                    build = tp('thanks', $fragment);
                    $contacts.appendChild($fragment);
                },
                onError: function () {
                    alert('sent message failed');
                }
            });
        }
        else {
            console.log(a9.l10n('feedbackFields_checkEntries', 'firstUpper'))
        }
    }

    function buildContactsForm() {


        $fragment = global.document.createDocumentFragment();

        //a9.each(mediaData, function(mediaItem){
        //    build = tp('mediaItem',mediaItem, $fragment)
        //});

        build = tp('feedbackForm', $fragment);

        $feedbackForm = build.r;

        feedbackData.customerName = build.customerName;
        feedbackData.email = build.email;
        feedbackData.antiSpam = build.antiSpam;
        feedbackData.question = build.question;

        $button = build.button;

        a9.addEvent($button, eventOnPointerEnd, submit);

        $contacts.appendChild($fragment);
    }

    var $contacts = tp('contacts', $parent).formContainer;
    buildContactsForm();

};
