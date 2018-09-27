@Library('deploy')
import deploy

def deployLib = new deploy()

node {
    def commitHashShort, committer, releaseVersion

    def app = "pam-kandidatsok"
    def appConfig = "nais.yaml"
    def dockerRepo = "repo.adeo.no:5443"
    def groupId = "nais"
    def environment = 't6'
    def zone = 'sbs'
    def namespace = "t6"
    def policies = "app-policies.xml"
    def notenforced = "not-enforced-urls.txt"

    stage("checkout") {
        deleteDir()
        checkout scm

        commitHashShort = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        committer = sh(script: 'git log -1 --pretty=format:"%an"', returnStdout: true).trim()

        releaseVersion = "0.0.${env.BUILD_NUMBER}-${commitHashShort}"

        echo "release version: ${releaseVersion}"
    }

    stage("npm install") {
        withEnv(['HTTPS_PROXY=http://webproxy-utvikler.nav.no:8088', 'HTTP_PROXY=http://webproxy-utvikler.nav.no:8088', 'NO_PROXY=localhost,127.0.0.1,maven.adeo.no', 'NODE_TLS_REJECT_UNAUTHORIZED=0', 'PORT=8081']) {
            sh "npm install"
        }
    }

    stage("Build") {
        sh "npm run build"
        sh "docker build --build-arg version=${releaseVersion} --build-arg app_name=${app} -t ${dockerRepo}/${app}:${releaseVersion} ."
    }

    stage("Publish") {
        withCredentials([usernamePassword(credentialsId: 'nexusUploader', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
            sh "docker login -u ${env.NEXUS_USERNAME} -p ${env.NEXUS_PASSWORD} ${dockerRepo} && docker push ${dockerRepo}/${app}:${releaseVersion}"
            sh "curl --user ${env.NEXUS_USERNAME}:${env.NEXUS_PASSWORD} --upload-file ${appConfig} https://repo.adeo.no/repository/raw/nais/${app}/${releaseVersion}/nais.yaml"
        }
    }

    stage("publish openAm files") {
        withCredentials([usernamePassword(credentialsId: 'nexusUploader', usernameVariable: 'NEXUS_USERNAME', passwordVariable: 'NEXUS_PASSWORD')]) {
            sh "curl --user ${env.NEXUS_USERNAME}:${env.NEXUS_PASSWORD} --upload-file ${policies} https://repo.adeo.no/repository/raw/nais/${app}/${releaseVersion}/am/app-policies.xml"
            sh "curl --user ${env.NEXUS_USERNAME}:${env.NEXUS_PASSWORD} --upload-file ${notenforced} https://repo.adeo.no/repository/raw/nais/${app}/${releaseVersion}/am/not-enforced-urls.txt"
        }
    }

    stage('Deploy to preprod') {
        callback = "${env.BUILD_URL}input/Deploy/"
        def deploy = deployLib.deployNaisApp(app, releaseVersion, environment, zone, namespace, callback, committer, false).key
        try {
            timeout(time: 15, unit: 'MINUTES') {
                input id: 'deploy', message: "Check status here:  https://jira.adeo.no/browse/${deploy}"
            }
        } catch (Exception e) {
            throw new Exception("Deploy feilet :( \n Se https://jira.adeo.no/browse/" + deploy + " for detaljer", e)
        }

    }

    stage('Tag GitHub release') {
        withEnv(['HTTPS_PROXY=http://webproxy-utvikler.nav.no:8088']) {
            withCredentials([string(credentialsId: 'navikt-ci-oauthtoken', variable: 'token')]) {
                sh ("git tag -a ${releaseVersion} -m ${releaseVersion}")
                sh ("git push -u https://${token}:x-oauth-basic@github.com/navikt/${app}.git --tags")
            }
        }
    }

    // QA
    def qaDir = "${env.WORKSPACE}/qa"
    def folder = new File(qaDir)
    def uuDefinitionFile = "${app}.yml"
    if (folder.exists()) {
        stage("Functional acceptance tests") {
            acceptanceTest(qaDir)
        }
        if (fileExists("${qaDir}/${uuDefinitionFile}")) {
			stage("UU-tests") {
				uuTests(qaDir, uuDefinitionFile)
			}
		}
    }
}

def acceptanceTest(qaDir) {
    echo "Running QA tests"
    withEnv(['HTTPS_PROXY=http://webproxy-internett.nav.no:8088', 'HTTP_PROXY=http://webproxy-internett.nav.no:8088', 'NO_PROXY=localhost,127.0.0.1,maven.adeo.no', 'NODE_TLS_REJECT_UNAUTHORIZED=0', 'PORT=8081']) {
        try {
            sh "cd ${qaDir} && npm i -D"
            sh "cd ${qaDir} && npm i chromedriver@2.38.3 -D"
            sh "cd ${qaDir} && npm run-script cucumber-jenkins -- --skiptags ignore --tag elastic"
        } catch (Exception e) {
            sh "cd ${qaDir} && npm run-script cucumber-report "
            publishHTML([allowMissing: false, alwaysLinkToLastBuild: true, keepAll: false, reportDir: 'qa/reports', reportFiles: 'cucumber_report.html', reportName: 'Cucumber Report'])
            throw new Exception("Cucumber/Nightwatch-tester feilet, se Cucumber Report for detaljer", e)
        }
        sh "cd ${qaDir} && npm run-script cucumber-report "
        publishHTML([allowMissing: false, alwaysLinkToLastBuild: true, keepAll: false, reportDir: 'qa/reports', reportFiles: 'cucumber_report.html', reportName: 'Cucumber Report'])
    }
}

def uuTests(qaDir, uuDefinitionFile) {
	withCredentials([string(credentialsId: 'navikt-ci-oauthtoken', variable: 'token')]) {
        withEnv(['HTTPS_PROXY=http://webproxy-utvikler.nav.no:8088']) {
            sh "cd ${qaDir} && git clone https://${token}:x-oauth-basic@github.com/navikt/pus-uu-validator.git"
        }
    }
    withEnv(['HTTPS_PROXY=http://webproxy-internett.nav.no:8088', 'HTTP_PROXY=http://webproxy-internett.nav.no:8088', 'NO_PROXY=localhost,127.0.0.1,maven.adeo.no,oera.no', 'NODE_TLS_REJECT_UNAUTHORIZED=0', 'PORT=8081']) {
        try {
            sh "cd ${qaDir}/pus-uu-validator && npm i"
			sh "cd ${qaDir}/pus-uu-validator && npm i chromedriver@2.38.3"
			sh "cd ${qaDir}/pus-uu-validator && DEFINITION_FILE=../${uuDefinitionFile} npm run test-uu"
        } catch (Exception e) {
            println("UU-tester feilet")
        }
    }
}
