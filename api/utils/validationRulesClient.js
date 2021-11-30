const validationRulesClient = {
    register: {
        firstname: {
            required: true,
            max: 32
        },
        lastname: {
            required: true,
            max: 32
        },
        email: {
            required: true,
            email: true
        },
        password: {
            required: true,
            max: 128
        },
        password_confirmation: {
            required: true,
            max: 128,
            confirmed: 'password_confirmation'
        }
    },
    template: {
        required: true
    },
    slug: {
        required: true,
        min: 2,
        max: 64,
        regex: /^[A-Za-z0-9-]+$/
    },
    job_title: {
        required: true,
        min: 2,
        max: 32
    },
    job_description: {
        max: 512
    },
    // user: {
    //     required: true,
    // },
    password: {
        required: true,
        min: 6,
        max: 64,
        confirmed: 'password_confirmation'
    },
    // visitor_password: {
    //     min: 6,
    //     max: 64
    // },
    // password_confirmation: {
    //     // min: 6,
    //     // max: 64,
    //     confirmed: 'password'
    // },
    // visitor_password: {
    //     min: 6,
    //     max: 64,
    //     confirmed: 'visitor_password_confirmation'
    // },
    // visitor_password_confirmation: {
    //     // min: 6,
    //     // confirmed: 'visitor_password_confirmation'
    // },
    personal_data: {
        firstname: {
            required: true,
            max: 32
        },
        lastname: {
            required: true,
            max: 32
        },
        middlename: {
            max: 32
        },
        email: {
            required: true,
            max: 128,
            regex: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
        },
        phone_number: {
            min: 6,
            max: 32
        },
        website: {
            max: 128
        },
        birthday: {
            max: 32
        },
        city: {
            max: 32
        },
        country: {
            max: 32
        }
    },
    education: {
        title: {
            required: true,
            max: 64
        },
        school: {
            max: 64
        },
        city: {
            max: 64
        },
        country: {
            max: 64
        },
        description: {
            max: 1024
        },
        start_date: {
            max: 32
        },
        end_date: {
            max: 32
        }
    },
    work_experience: {
        job_title: {
            required: true,
            max: 64
        },
        job_description: {
            max: 1024
        },
        company: {
            max: 64
        },
        city: {
            max: 64
        },
        country: {
            max: 64
        },
        start_date: {
            max: 32
        },
        end_date: {
            max: 32
        }
    },
    skill: {        
        name: {
            max: 32
        },
        slug: {
            max: 32
        },
        category: {
            max: 32
        },
        new_category_name: {
            max: 32
        },
        type: {
            max: 32
        },
        value: {
            min: 1,
            max: 100
        }
    },
    upload: {
        name: {
            max: 512
        },
        title: {
            // min: 2,
            max: 64
        },
        mime_type: {
            max: 64
        },
        category: {
            max: 64
        },
        download_url: {
            max: 512
        }
    },
    social_network: {
        name: {
            required: true,
            max: 64
        },
        slug: {
            max: 64
        },
        icon: {
            max: 64
        },
        link: {
            max: 512
        }
    },
    language: {
        name: {
            max: 64
        },
        slug: {
            max: 64
        },
        native_name: {
            max: 64
        },
        code: {
            max: 64
        },
        level: {
            min: 1,
            max: 100
        }
    },
    nationality: {
        name: {
            required: true,
            max: 64
        },
        slug: {
            max: 64
        },
    },
    colors: {
        background: {
            max: 10
        },
        text: {
            max: 10
        },
        primary: {
            max: 10
        },
        secondary: {
            max: 10
        },
        tertiary: {
            max: 10
        }
    },
    menus: {
        contact: {
            max: 32
        },
        education: {
            max: 32
        },
        files: {
            max: 32
        },
        home: {
            max: 32
        },
        presentation: {
            max: 32
        },
        skills: {
            max: 32
        },
        work_experience: {
            max: 32
        }
    },
    forgot_password: {
        email: {
            required: true,
            max: 128,
            regex: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
        },
    }
}

export default validationRulesClient