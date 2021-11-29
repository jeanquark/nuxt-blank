const advancedResults = (model, populate) => async (req, res, next) => {
    let query

    // Copy req.query
    const reqQuery = { ...req.query }
    console.log('advancedResults reqQuery: ', reqQuery)
    console.log('req.query.limit: ', req.query.limit)
    console.log('req.query.select: ', req.query.select)
    // console.log('req.query.search: ', req.query.search)
    console.log('populate: ', populate)

    // Fields to exclude
    // const removeFields = ['select', 'sort', 'page', 'limit']
    const removeFields = ['select', 'sort', 'page', 'limit']

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param])

    // Create query string
    console.log('reqQuery: ', reqQuery)
    if (reqQuery.hasOwnProperty('undefined')) {
        console.log('no query!')
        query = model.find({})
    } else {
        console.log('query is present!')
        let queryStr = JSON.stringify(reqQuery)
        console.log('queryStr2: ', queryStr)

        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
        console.log('queryStr3: ', queryStr)
        query = model.find(JSON.parse(queryStr))
    }

    // Finding resource with or without search parameter
    let total = await model.countDocuments()

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort('-created_at')
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25
    console.log('limit: ', limit)
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    // const total = await model.countDocuments()
    console.log('total: ', total)

    query = query.skip(startIndex).limit(limit)

    // Populate
    if (populate) {
        if (Array.isArray(populate)) {
            for (let i = 0; i < populate.length; i++) {
                const key = Object.keys(populate[i])
                const value = Object.values(populate[i])
                query = query.populate(key[0], value[0])
            }
        } else {
            query = query.populate(populate)
        }
    }

    // Executing query
    const results = await query
    // console.log('results: ', results)
    // console.log('query.countDocuments(): ', query.countDocuments())

    // Pagination result
    const pagination = {}

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
    console.log('pagination: ', pagination)

    res.advancedResults = {
        success: true,
        total,
        count: results.length,
        pagination,
        data: results,
        // abc
    }

    next()
}

module.exports = advancedResults
