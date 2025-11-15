frappe.listview_settings['PDC Cheque'] = {
    refresh: function(listview) {
        listview.page.add_inner_button(__('PDC To Bank Selected'), function() {
            const selected_docs = listview.get_checked_items();
            if (selected_docs.length === 0) {
                frappe.msgprint(__("No records selected."));
                return;
            }

            // Filter out records that already have a journal entry
            const records_to_process = selected_docs.filter(doc => !doc.journal_entry);

            if (records_to_process.length === 0) {
                frappe.msgprint(__("All selected records already have a Journal Entry."));
                return;
            }
            
            // Assumption: All selected cheques belong to the same company.
            // Fetch the full document of the first record to get company details.
            frappe.call({
                method: "frappe.client.get",
                args: {
                    doctype: "PDC Cheque",
                    name: records_to_process[0].name
                },
                callback: function(response) {
                    const first_doc = response.message;
                    if (!first_doc) {
                        frappe.msgprint(__("Could not load document {0}", [records_to_process[0].name]));
                        return;
                    }
                    // Open bank selection dialog once
                    open_bank_selection_dialog(first_doc.company, (bank_account) => {
                        // Process each selected record
                        records_to_process.forEach(docinfo => {
                            create_journal_entry_for_doc(docinfo.name, bank_account);
                        });
                        
                        frappe.show_alert({
                            message: __("Journal Entry creation started for {0} records.", [records_to_process.length]),
                            indicator: 'green'
                        });
                        setTimeout(() => listview.refresh(), 2000);
                    });
                }
            });
        });
    }
};

function open_bank_selection_dialog(company, callback) {
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Account',
            filters: {
                account_type: 'Bank',
                is_group: 0,
                company: company,
                disabled: 0
            },
            fields: ['name', 'account_name'],
            limit_page_length: 500
        },
        callback: function(r) {
            const accounts = (r.message || []).map(acc => ({
                label: `${acc.account_name || acc.name} (${acc.name})`,
                value: acc.name
            }));

            if (accounts.length === 0) {
                frappe.msgprint(__('No bank accounts found for the company.'));
                return;
            }

            const d = new frappe.ui.Dialog({
                title: __('Select Bank Account'),
                fields: [
                    {
                        fieldname: 'bank_account',
                        fieldtype: 'Select',
                        label: __('Bank Account'),
                        options: accounts,
                        reqd: 1
                    }
                ],
                primary_action_label: __('Create Journal Entries'),
                primary_action(values) {
                    if (!values.bank_account) {
                        frappe.msgprint(__('Please select a bank account.'));
                        return;
                    }
                    d.hide();
                    callback(values.bank_account);
                }
            });
            d.show();
        }
    });
}

function create_journal_entry_for_doc(doc_name, bank_account) {
    frappe.call({
        method: 'cheque_collection.cheque_collection.doctype.pdc_cheque.pdc_cheque.create_journal_entry',
        args: {
            pdc_cheque_name: doc_name,
            bank_account: bank_account
        },
        callback: function(res) {
            if (res.message) {
                console.log(`Journal Entry ${res.message} created for ${doc_name}`);
            }
        }
    });
}

function open_bank_selection_dialog(company, callback) {
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Account',
            filters: {
                account_type: 'Bank',
                is_group: 0,
                company: company,
                disabled: 0
            },
            fields: ['name', 'account_name'],
            limit_page_length: 500
        },
        callback: function(r) {
            const accounts = (r.message || []).map(acc => ({
                label: `${acc.account_name || acc.name} (${acc.name})`,
                value: acc.name
            }));

            if (accounts.length === 0) {
                frappe.msgprint(__('No bank accounts found for the company.'));
                return;
            }

            const d = new frappe.ui.Dialog({
                title: __('Select Bank Account'),
                fields: [
                    {
                        fieldname: 'bank_account',
                        fieldtype: 'Select',
                        label: __('Bank Account'),
                        options: accounts,
                        reqd: 1
                    }
                ],
                primary_action_label: __('Create Journal Entries'),
                primary_action(values) {
                    if (!values.bank_account) {
                        frappe.msgprint(__('Please select a bank account.'));
                        return;
                    }
                    d.hide();
                    callback(values.bank_account);
                }
            });
            d.show();
        }
    });
}

function create_journal_entry_for_doc(doc_name, bank_account) {
    frappe.call({
        method: 'cheque_collection.cheque_collection.doctype.pdc_cheque.pdc_cheque.create_journal_entry',
        args: {
            pdc_cheque_name: doc_name,
            bank_account: bank_account
        },
        callback: function(res) {
            if (res.message) {
                console.log(`Journal Entry ${res.message} created for ${doc_name}`);
            }
        }
    });
}


function open_bank_selection_dialog(company, callback) {
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Account',
            filters: {
                account_type: 'Bank',
                is_group: 0,
                company: company,
                disabled: 0
            },
            fields: ['name', 'account_name'],
            limit_page_length: 500
        },
        callback: function(r) {
            const accounts = (r.message || []).map(acc => ({
                label: `${acc.account_name || acc.name} (${acc.name})`,
                value: acc.name
            }));

            if (accounts.length === 0) {
                frappe.msgprint(__('No bank accounts found for the company.'));
                return;
            }

            const d = new frappe.ui.Dialog({
                title: __('Select Bank Account'),
                fields: [
                    {
                        fieldname: 'bank_account',
                        fieldtype: 'Select',
                        label: __('Bank Account'),
                        options: accounts,
                        reqd: 1
                    }
                ],
                primary_action_label: __('Create Journal Entries'),
                primary_action(values) {
                    if (!values.bank_account) {
                        frappe.msgprint(__('Please select a bank account.'));
                        return;
                    }
                    d.hide();
                    callback(values.bank_account);
                }
            });
            d.show();
        }
    });
}

function create_journal_entry_for_doc(doc_name, bank_account) {
    frappe.call({
        method: 'cheque_collection.cheque_collection.doctype.pdc_cheque.pdc_cheque.create_journal_entry',
        args: {
            pdc_cheque_name: doc_name,
            bank_account: bank_account
        },
        callback: function(res) {
            if (res.message) {
                console.log(`Journal Entry ${res.message} created for ${doc_name}`);
            }
        }
    });
}


function open_bank_selection_dialog(company, callback) {
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Account',
            filters: {
                account_type: 'Bank',
                is_group: 0,
                company: company,
                disabled: 0
            },
            fields: ['name', 'account_name'],
            limit_page_length: 500
        },
        callback: function(r) {
            const accounts = (r.message || []).map(acc => ({
                label: `${acc.account_name || acc.name} (${acc.name})`,
                value: acc.name
            }));

            if (accounts.length === 0) {
                frappe.msgprint(__('No bank accounts found for the company.'));
                return;
            }

            const d = new frappe.ui.Dialog({
                title: __('Select Bank Account'),
                fields: [
                    {
                        fieldname: 'bank_account',
                        fieldtype: 'Select',
                        label: __('Bank Account'),
                        options: accounts,
                        reqd: 1
                    }
                ],
                primary_action_label: __('Create Journal Entries'),
                primary_action(values) {
                    if (!values.bank_account) {
                        frappe.msgprint(__('Please select a bank account.'));
                        return;
                    }
                    d.hide();
                    callback(values.bank_account);
                }
            });
            d.show();
        }
    });
}

function create_journal_entry_for_doc(doc_name, bank_account) {
    frappe.call({
        method: 'cheque_collection.cheque_collection.doctype.pdc_cheque.pdc_cheque.create_journal_entry',
        args: {
            pdc_cheque_name: doc_name,
            bank_account: bank_account
        },
        callback: function(res) {
            if (res.message) {
                console.log(`Journal Entry ${res.message} created for ${doc_name}`);
            }
        }
    });
}


function open_bank_selection_dialog(company, callback) {
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Account',
            filters: {
                account_type: 'Bank',
                is_group: 0,
                company: company,
                disabled: 0
            },
            fields: ['name', 'account_name'],
            limit_page_length: 500
        },
        callback: function(r) {
            const accounts = (r.message || []).map(acc => ({
                label: `${acc.account_name || acc.name} (${acc.name})`,
                value: acc.name
            }));

            if (accounts.length === 0) {
                frappe.msgprint(__('No bank accounts found for the company.'));
                return;
            }

            const d = new frappe.ui.Dialog({
                title: __('Select Bank Account'),
                fields: [
                    {
                        fieldname: 'bank_account',
                        fieldtype: 'Select',
                        label: __('Bank Account'),
                        options: accounts,
                        reqd: 1
                    }
                ],
                primary_action_label: __('Create Journal Entries'),
                primary_action(values) {
                    if (!values.bank_account) {
                        frappe.msgprint(__('Please select a bank account.'));
                        return;
                    }
                    d.hide();
                    callback(values.bank_account);
                }
            });
            d.show();
        }
    });
}

function create_journal_entry_for_doc(doc_name, bank_account) {
    frappe.call({
        method: 'cheque_collection.cheque_collection.doctype.pdc_cheque.pdc_cheque.create_journal_entry',
        args: {
            pdc_cheque_name: doc_name,
            bank_account: bank_account
        },
        callback: function(res) {
            if (res.message) {
                console.log(`Journal Entry ${res.message} created for ${doc_name}`);
            }
        }
    });
}


function open_bank_selection_dialog(company, callback) {
    frappe.call({
        method: 'frappe.client.get_list',
        args: {
            doctype: 'Account',
            filters: {
                account_type: 'Bank',
                is_group: 0,
                company: company,
                disabled: 0
            },
            fields: ['name', 'account_name'],
            limit_page_length: 500
        },
        callback: function(r) {
            const accounts = (r.message || []).map(acc => ({
                label: `${acc.account_name || acc.name} (${acc.name})`,
                value: acc.name
            }));

            if (accounts.length === 0) {
                frappe.msgprint(__('No bank accounts found for the company.'));
                return;
            }

            const d = new frappe.ui.Dialog({
                title: __('Select Bank Account'),
                fields: [
                    {
                        fieldname: 'bank_account',
                        fieldtype: 'Select',
                        label: __('Bank Account'),
                        options: accounts,
                        reqd: 1
                    }
                ],
                primary_action_label: __('Create Journal Entries'),
                primary_action(values) {
                    if (!values.bank_account) {
                        frappe.msgprint(__('Please select a bank account.'));
                        return;
                    }
                    d.hide();
                    callback(values.bank_account);
                }
            });
            d.show();
        }
    });
}

function create_journal_entry_for_doc(doc_name, bank_account) {
    frappe.call({
        method: 'cheque_collection.cheque_collection.doctype.pdc_cheque.pdc_cheque.create_journal_entry',
        args: {
            pdc_cheque_name: doc_name,
            bank_account: bank_account
        },
        callback: function(res) {
            if (res.message) {
                console.log(`Journal Entry ${res.message} created for ${doc_name}`);
            }
        }
    });
}

// function get_checked_items() {
//   return frappe.get_list_view().get_checked_items();
// }

// // update status of checked items to 'Paid'
// function update_status(items) {
//   frappe.call({
//     method: 'custom_app.custom_app.doctype.payment_entry.payment_entry.update_status',
//     args: {
//       items: items
//     },
//     callback: function(r) {
//       if (r.message) {
//         frappe.msgprint(r.message);
//       }
//       frappe.get_list_view().refresh();
//     }
//   });
// }

// // add button to list view
// frappe.listview_settings['Payment Entry'].onload = function(listview) {
//   listview.page.add_menu_item('Mark as Paid', function() {
//     var items = get_checked_items();
//     if (items.length > 0) {
//       update_status(items);
//     } else {
//       frappe.msgprint('Please select some items first.');
//     }
//   });
// }