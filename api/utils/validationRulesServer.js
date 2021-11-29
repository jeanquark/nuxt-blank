// Translation files are located at the /lang folder

const validationRulesServer = {
    register: {
        firstname: {
            required: [true, 'server.required'],
            maxlength: [32, 'server.max']
        },
        lastname: {
            required: [true, 'server.required'],
            maxlength: [32, 'server.max']
        },
        email: {
            required: [true, 'server.required'],
            match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'server.email']
        },
        password: {
            required: [true, 'server.required'],
            maxlength: [128, 'server.max']
        },
    },
    slug: {
        required: [true, 'server.required'],
        minlength: [2, 'server.min'],
        maxlength: [64, 'server.max'],
        match: [/^[A-Za-z0-9-]+$/, 'server.alpha_num'],
        unique: true,
    },
    job_title: {
        required: [true, 'server.required'],
        minlength: [2, 'server.min'],
        // maxlength: [4, 'server.max']
        maxlength: [32, 'server.max']
    },
    job_description: {
        maxlength: [512, 'server.max'],
    },
    // password: {
    //     required: [true, 'server.required'],
    //     minLength: [6, 'server.min'],
    //     maxlength: [64, 'server.max'],
    //     // required: function() {
    //     //     return this.slug.length < 1
    //     // }
    // },
    // visitor_password: {
    //     minLength: [6, 'server.min'],
    //     maxlength: [64, 'server.max']
    // },
    user: {
        required: [true, 'server.required']
    },
    template: {
        required: [true, 'server.required']
    },
    personal_data: {
        // slug: {
        //     required: [true, 'Please add a slug'],
        //     minlength: [2, 'Slug must have at least 2 characters'],
        //     maxlength: [4, 'Slug can have max {PATH} {VALUE} {TYPE} characters'],
        //     match: [/^[a-z0-9-]+$/, 'Only alphanumeric characters'],
        //     // unique: true,
        // },
        firstname: {
            required: [true, 'server.required'],
            maxlength: [32, 'server.max']
            // maxlength: [2, 'server.max']
        },
        lastname: {
            required: [true, 'server.required'],
            maxlength: [32, 'server.max']
        },
        middlename: {
            maxlength: [32, 'server.max']
        },
        email: {
            required: [true, 'server.required'],
            maxlength: [128, 'server.max'],
            match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'server.email']
        },
        phone_number: {
            minlength: [6, 'server.min'],
            maxlength: [32, 'server.max']
        },
        website: {
            maxlength: [128, 'server.max']
        },
        birthday: {
            maxlength: [32, 'server.max']
        },
        city: {
            maxlength: [32, 'server.max']
        },
        country: {
            maxlength: [32, 'server.max']
        }
    },
    education: {
        title: {
            required: [true, 'server.required'],
            maxlength: [64, 'server.max'],
        },
        school: {
            maxlength: [64, 'server.max'],
        },
        city: {
            maxlength: [64, 'server.max'],
        },
        country: {
            maxlength: [64, 'server.max'],
        },
        description: {
            maxlength: [1024, 'server.max'],
        },
        start_date: {
            maxlength: [32, 'server.max'],
        },
        end_date: {
            maxlength: [32, 'server.max'],
        }
    },
    work_experience: {
        job_title: {
            required: [true, 'server.required'],
            maxlength: [64, 'server.max']
        },
        job_description: {
            maxlength: [1024, 'server.max']
        },
        company: {
            maxlength: [64, 'server.max']
        },
        city: {
            maxlength: [64, 'server.max']
        },
        country: {
            maxlength: [64, 'server.max']
        },
        start_date: {
            maxlength: [32, 'server.max']
        },
        end_date: {
            maxlength: [32, 'server.max']
        }
    },
    skill: {
        name: {
            maxlength: [32, 'server.max']
        },
        slug: {
            maxlength: [32, 'server.max']
        },
        category: {
            maxlength: [32, 'server.max']
        },
        type: {
            maxlength: [32, 'server.max']
        },
        value: {
            minlength: [1, 'server.min_number'],
            maxlength: [100, 'server.max_number']
        }
    },
    upload: {
        name: {
            maxlength: [512, 'server.max']
        },
        title: {
            // minlength: [2, 'server.min'],
            maxlength: [64, 'server.max']
        },
        mime_type: {
            maxlength: [64, 'server.max']
        },
        category: {
            maxlength: [64, 'server.max']
        },
        download_url: {
            maxlength: [512, 'server.max']
        }
    },
    social_network: {
        name: {
            required: [true, 'server.required'],
            maxlength: [64, 'server.max']
        },
        slug: {
            maxlength: [64, 'server.max']
        },
        icon: {
            maxlength: [64, 'server.max']
        },
        link: {
            maxlength: [512, 'server.max']
        }
    },
    language: {
        name: {
            maxlength: [64, 'server.max']
        },
        slug: {
            maxlength: [64, 'server.max']
        },
        native_name: {
            maxlength: [64, 'server.max']
        },
        code: {
            maxlength: [64, 'server.max']
        },
        level: {
            minlength: [1, 'server.min_number'],
            maxlength: [100, 'server.max_number']
        }
    },
    nationality: {
        name: {
            required: [true, 'server.required'],
            maxlength: [64, 'server.max']
        },
        slug: {
            maxlength: [64, 'server.max']
        },
    },
    colors: {
        background: {
            maxlength: [10, 'server.max']
        },
        text: {
            maxlength: [10, 'server.max']
        },
        primary: {
            maxlength: [10, 'server.max']
        },
        secondary: {
            maxlength: [10, 'server.max']
        },
        tertiary: {
            maxlength: [10, 'server.max']
        }
    },
    menus: {
        contact: {
            maxlength: [32, 'server.max']
        },
        education: {
            maxlength: [32, 'server.max']
        },
        files: {
            maxlength: [32, 'server.max']
        },
        home: {
            maxlength: [32, 'server.max']
        },
        presentation: {
            maxlength: [32, 'server.max']
        },
        skills: {
            maxlength: [32, 'server.max']
        },
        work_experience: {
            maxlength: [32, 'server.max']
        },
    }
}

module.exports = validationRulesServer
