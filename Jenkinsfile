// Pipeline Jenkins equivalent au workflow GitHub Actions (voir guide ElectroBike).
// Prerequis Jenkins : outil NodeJS nomme 'Node20', credentials 'dockerhub-credentials'.
pipeline {
  agent any

  tools {
    nodejs 'Node20'
  }

  environment {
    IMAGE_NAME = "electrobike/api"
    IMAGE_TAG  = "${env.GIT_COMMIT ? env.GIT_COMMIT.take(7) : 'latest'}"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Install dependencies') {
      steps { sh 'npm ci' }
    }
    stage('Lint') {
      steps { sh 'npm run lint' }
    }
    stage('Test') {
      steps { sh 'npm test -- --coverage' }
    }
    stage('Build Docker image') {
      steps {
        script {
          dockerImage = docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
        }
      }
    }
    stage('Push Docker image') {
      when { branch 'main' }
      steps {
        script {
          docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
            dockerImage.push("${IMAGE_TAG}")
            dockerImage.push('latest')
          }
        }
      }
    }
  }

  post {
    success { echo "Build reussi : ${IMAGE_NAME}:${IMAGE_TAG}" }
    failure { echo "Le pipeline a echoue - voir les logs ci-dessus." }
    always  { cleanWs() }
  }
}
