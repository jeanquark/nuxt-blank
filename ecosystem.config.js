module.exports = {
	apps: [
		{
			name: 'NuxtBlank',
			exec_mode: 'cluster',
			instances: 'max', // Or a number of instances
			cwd: './current',
			script: './node_modules/nuxt/bin/nuxt.js',
			args: 'start'
		}
	]
}