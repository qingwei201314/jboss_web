package test;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import javax.faces.model.SelectItem;

@ManagedBean
@SessionScoped
public class LocationBean implements Serializable {
	private static final long serialVersionUID = 1L;
	private String state, city;
	private boolean isCityListDisabled = true;

	public String getState() {
		System.out.println("getState");
		return (state);
	}

	public void setState(String state) {
		System.out.println("setState");
		this.state = state;
		isCityListDisabled = false;
	}

	public String getCity() {
		System.out.println("getCity");
		return (city);
	}

	public void setCity(String city) {
		System.out.println("setCity");
		this.city = city;
	}

	public boolean isCityListDisabled() {
		System.out.println("isCityListDisabled");
		return (isCityListDisabled);
	}

	public List<SelectItem> getStates() {
		System.out.println("getStates");
		List<SelectItem> states = new ArrayList<SelectItem>();
		states.add(new SelectItem("--- Select State ---"));
		for (StateInfo stateData : StateInfo.getNearbyStates()) {
			states.add(new SelectItem(stateData.getStateName()));
		}
		return (states);
	}

	public SelectItem[] getCities() {
		System.out.println("getCities");
		SelectItem[] cities = { new SelectItem("--- Choose City ---") };
		if (!isCityListDisabled && (state != null)) {
			for (StateInfo stateData : StateInfo.getNearbyStates()) {
				if (state.equals(stateData.getStateName())) {
					cities = stateData.getCities();
					break;
				}
			}
		}
		return (cities);
	}
}
