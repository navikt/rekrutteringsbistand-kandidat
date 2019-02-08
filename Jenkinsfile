@Library('deploy')
import deploy

def deployLib = new deploy()

// Obtain ephemeral "installation" API token which can be used for GitHub repository access.
// A token is valid for one hour after creation.
githubAppId = '23179'
githubAppCredentialId = 'teampam-ci'
def newApiToken() {
    withEnv(['HTTPS_PROXY=webproxy-internett.nav.no:8088']) {
        withCredentials([file(credentialsId: githubAppCredentialId, variable: 'KEYFILE')]) {
            dir('token') {
                def generatedToken = sh(script: "generate-jwt.sh \$KEYFILE ${githubAppId} | xargs generate-installation-token.sh", returnStdout: true)
                return generatedToken.trim()
            }
        }
    }
}

node {
    def commitHashShort, committer, releaseVersion

    def app = "pam-kandidatsok"
    def appConfig = "nais.yaml"
    def dockerRepo = "repo.adeo.no:5443"
    def groupId = "nais"
    def environment = 'q6'
    def zone = 'sbs'
    def namespace = "q6"
    def policies = "app-policies.xml"
    def notenforced = "not-enforced-urls.txt"
    def repo = "navikt"
    def githubAppToken = newApiToken();
    def useSaucelabs = env.USE_SAUCELABS

    stage("checkout") {
        cleanWs()
        withEnv(['HTTPS_PROXY=http://webproxy-internett.nav.no:8088']) {
            // githubAppToken is not a magic secret variable, so mask it manually by disabling shell echo
            // Would be great if withCredentials could be used to mask the value, mark it as secret, or similar
            println("Repository URL is https://x-access-token:****@github.com/${repo}/${app}.git")
            sh(script: "set +x; git clone https://x-access-token:${githubAppToken}@github.com/${repo}/${app}.git .")
        }

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

    stage("tag") {
        withEnv(['HTTPS_PROXY=http://webproxy-internett.nav.no:8088']) {
            sh "git tag -a ${releaseVersion} -m ${releaseVersion}"
            sh ("git push -q origin --tags")
        }
    }

    // QA
    def qaDir = "${env.WORKSPACE}/qa"
    def folder = new File(qaDir)
    def uuDefinitionFile = "${app}.yml"
    if (folder.exists()) {
        stage("Functional acceptance tests") {
            acceptanceTest(app, useSaucelabs)
        }
//      if (fileExists("${qaDir}/${uuDefinitionFile}")) {
//			stage("UU-tests") {
//				uuTests(uuDefinitionFile)
//			}
//		}
    }
}

def acceptanceTest(qaDir) {
    echo "Running QA tests"
    withEnv(['HTTPS_PROXY=http://webproxy-internett.nav.no:8088', 'HTTP_PROXY=http://webproxy-internett.nav.no:8088', 'NO_PROXY=localhost,127.0.0.1,maven.adeo.no', 'NODE_TLS_REJECT_UNAUTHORIZED=0', 'PORT=8081']) {
        qaDir = "./qa"
        if (useSaucelabs == 'true') {
            sh "cd ${qaDir} && npm i -D"
            sauce('sauceconnect') {
                sauceconnect(options: "--proxy webproxy-internett.nav.no:8088 --proxy-tunnel --tunnel-identifier jenkins-${app} --se-port 4445", useLatestSauceConnect: true) {
                    try {
                        sh "cd ${qaDir} && npm run-script sauce-jenkins-default -- --skiptags ignore"
                    } catch (Exception e) {
                        throw new Exception("Cucumber/Nightwatch-tester feilet, se Cucumber Report for detaljer", e)
                    } finally {
                        sh "cd ${qaDir} && npm run-script cucumber-report "
                        publishHTML([allowMissing: false, alwaysLinkToLastBuild: true, keepAll: false, reportDir: 'qa/reports', reportFiles: 'cucumber_report.html', reportName: 'Cucumber Report'])
                    }
                }
            }
        } else {
            sh "cd ${qaDir} && npm i chromedriver selenium-server-standalone-jar -D"
            try {
                sh "cd ${qaDir} && npm run-script chrome-jenkins -- --skiptags ignore"
            } catch (Exception e) {
                throw new Exception("Cucumber/Nightwatch-tester feilet, se Cucumber Report for detaljer", e)
            } finally {
                sh "cd ${qaDir} && npm run-script cucumber-report "
                publishHTML([allowMissing: false, alwaysLinkToLastBuild: true, keepAll: false, reportDir: 'qa/reports', reportFiles: 'cucumber_report.html', reportName: 'Cucumber Report'])
            }
        }
    }
}

def uuTests(uuDefinitionFile) {
	qaDir = "./qa"
	withCredentials([string(credentialsId: 'navikt-ci-oauthtoken', variable: 'token')]) {
        withEnv(['HTTPS_PROXY=http://webproxy-utvikler.nav.no:8088']) {
            sh "cd ${qaDir} && git clone https://${token}:x-oauth-basic@github.com/navikt/pus-uu-validator.git"
        }
    }
    withEnv(['HTTPS_PROXY=http://webproxy-internett.nav.no:8088', 'HTTP_PROXY=http://webproxy-internett.nav.no:8088', 'NO_PROXY=localhost,127.0.0.1,maven.adeo.no,oera.no', 'NODE_TLS_REJECT_UNAUTHORIZED=0', 'PORT=8081']) {
        try {
            sh "cd ${qaDir}/pus-uu-validator && npm i"
            sh "cd ${qaDir}/pus-uu-validator && npm i chromedriver"
			sh "cd ${qaDir}/pus-uu-validator && DEFINITION_FILE=../${uuDefinitionFile} npm run test-uu"
        } catch (Exception e) {
            println("UU-tester feilet")
        }
    }
}
