import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Department } from '../models/department.model';
import { SelectOption } from '../config/module-config.model';
import { API_BASE } from '../api-base';

// Read-only, real GET call. This exists purely so the Students form can
// offer a department picker with real, valid IDs from the live database —
// it is NOT the Departments module's own UI (that stays mocked for now,
// see department.service.ts).
@Injectable({ providedIn: 'root' })
export class DepartmentLookupService {
  constructor(private http: HttpClient) {}

  listOptions(): Observable<SelectOption[]> {
    return this.http.get<ApiResponse<Department[]>>(`${API_BASE}/departments`).pipe(
      map((res) => (res.data ?? []).map((d) => ({ label: `${d.name} (${d.code})`, value: d._id })))
    );
  }
}
