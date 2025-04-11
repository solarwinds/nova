BRANCH=$1
REPOSITORY_TYPE="gh"
CIRCLE_API="https://circleci.com/api"
PROJECT_USERNAME="solarwinds"
PROJECT_REPONAME="nova"

DATA="{ \"branch\": \"$BRANCH\" }"
echo
echo "Triggering pipeline with data:"
echo "  $DATA"

URL="${CIRCLE_API}/v2/project/${REPOSITORY_TYPE}/${PROJECT_USERNAME}/${PROJECT_REPONAME}/pipeline"
echo $URL
HTTP_RESPONSE=$(curl -s -u ${CIRCLE_API_TOKEN}: -o response.txt -w "%{http_code}" -X POST --header "Content-Type: application/json" -d "$DATA" $URL)

if [ "$HTTP_RESPONSE" -ge "200" ] && [ "$HTTP_RESPONSE" -lt "300" ]; then
  echo "API call succeeded."
  echo "Response:"
  cat response.txt
else
  echo "Received status code: ${HTTP_RESPONSE}"
  echo "Response:"
  cat response.txt
  exit 1
fi
