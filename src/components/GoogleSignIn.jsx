

function GoogleSignIn() {

    const handleGoogleAccount = async () => {
        console.log("Successfully Signed In with Google");
        // await fetch('https://secrets-auth.vercel.app/auth/google/', {
        //   method: 'GET'
        // })
    }
    
  return (
      <div>
          <button
              onClick={handleGoogleAccount}
              className="mt-6 flex w-full justify-center border-2 border-black/50 rounded-md bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
              <img
                  className="mx-2 h-6 w-auto"
                  src='googlelogo.svg'
                  alt="Google Logo"
              />
              Sign in with Google
          </button>
      </div>
  )
}

export default GoogleSignIn